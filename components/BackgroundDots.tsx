"use client"

import { useRef, useMemo, useEffect, useState, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// ─── Config shape ─────────────────────────────────────────────────────────────

interface DotsConfig {
  floatAmp: number
  floatSpeed: number
  spring: number
  damping: number
  repelStrength: number
  repelRadiusRatio: number
  dotSize: number
  opacity: number
  color: string
}

const DEFAULT_CONFIG: DotsConfig = {
  floatAmp: 0.05,
  floatSpeed: 0.25,
  spring: 0.015,
  damping: 0.9,
  repelStrength: 0.005,
  repelRadiusRatio: 0.1,
  dotSize: 1.5,
  opacity: 0.35,
  color: "#f59e0b",
}

const DOT_COUNT = 2500

// ─── Three.js scene ───────────────────────────────────────────────────────────

function DotsField({ configRef }: { configRef: React.MutableRefObject<DotsConfig> }) {
  const { viewport, camera } = useThree()
  const pointsRef = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.PointsMaterial>(null!)
  const mouse = useRef(new THREE.Vector3(-9999, -9999, 0))

  const { initPos, seeds } = useMemo(() => {
    const w = viewport.width || 30
    const h = viewport.height || 20
    const initPos = new Float32Array(DOT_COUNT * 3)
    const seeds = new Float32Array(DOT_COUNT * 2)
    for (let i = 0; i < DOT_COUNT; i++) {
      initPos[i * 3] = (Math.random() - 0.5) * w
      initPos[i * 3 + 1] = (Math.random() - 0.5) * h
      initPos[i * 3 + 2] = 0
      seeds[i * 2] = Math.random() * Math.PI * 2
      seeds[i * 2 + 1] = Math.random() * Math.PI * 2
    }
    return { initPos, seeds }
  }, [viewport.width, viewport.height])

  const vel = useMemo(() => new Float32Array(DOT_COUNT * 2), [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(initPos.slice(), 3))
    return g
  }, [initPos])

  useEffect(() => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const onMove = (e: MouseEvent) => {
      ndc.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
      raycaster.setFromCamera(ndc, camera)
      raycaster.ray.intersectPlane(plane, mouse.current)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [camera])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const cfg = configRef.current
    const mat = materialRef.current
    if (mat) {
      mat.size = cfg.dotSize
      mat.opacity = cfg.opacity
      mat.color.set(cfg.color)
    }

    const t = clock.getElapsedTime()
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array
    const mx = mouse.current.x
    const my = mouse.current.y
    const repelR = viewport.width * cfg.repelRadiusRatio
    const repelRSq = repelR * repelR

    for (let i = 0; i < DOT_COUNT; i++) {
      const i3 = i * 3
      const i2 = i * 2
      const tx = initPos[i3] + Math.sin(t * cfg.floatSpeed + seeds[i2]) * cfg.floatAmp
      const ty = initPos[i3 + 1] + Math.cos(t * cfg.floatSpeed * 0.8 + seeds[i2 + 1]) * cfg.floatAmp
      const dx = arr[i3] - mx
      const dy = arr[i3 + 1] - my
      const dSq = dx * dx + dy * dy
      if (dSq < repelRSq && dSq > 0.0001) {
        const d = Math.sqrt(dSq)
        const force = (1 - d / repelR) * cfg.repelStrength
        vel[i2] += (dx / d) * force
        vel[i2 + 1] += (dy / d) * force
      }
      vel[i2] += (tx - arr[i3]) * cfg.spring
      vel[i2 + 1] += (ty - arr[i3 + 1]) * cfg.spring
      vel[i2] *= cfg.damping
      vel[i2 + 1] *= cfg.damping
      arr[i3] += vel[i2]
      arr[i3 + 1] += vel[i2 + 1]
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        ref={materialRef}
        color={DEFAULT_CONFIG.color}
        size={DEFAULT_CONFIG.dotSize}
        sizeAttenuation={false}
        transparent
        opacity={DEFAULT_CONFIG.opacity}
      />
    </points>
  )
}

// ─── Debug panel ──────────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-0.5 mb-2">
      <div className="flex justify-between text-[10px]">
        <span className="text-zinc-300">{label}</span>
        <span className="font-mono text-amber-300">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-amber-400 h-1"
      />
    </label>
  )
}

function DebugPanel({ configRef }: { configRef: React.MutableRefObject<DotsConfig> }) {
  const [vals, setVals] = useState<DotsConfig>({ ...DEFAULT_CONFIG })
  const [copied, setCopied] = useState(false)

  const set = useCallback(<K extends keyof DotsConfig>(key: K, value: DotsConfig[K]) => {
    configRef.current[key] = value
    setVals(prev => ({ ...prev, [key]: value }))
  }, [configRef])

  const copy = useCallback(() => {
    const cfg = configRef.current
    const out = `floatAmp: ${cfg.floatAmp}
floatSpeed: ${cfg.floatSpeed}
spring: ${cfg.spring}
damping: ${cfg.damping}
repelStrength: ${cfg.repelStrength}
repelRadiusRatio: ${cfg.repelRadiusRatio}
dotSize: ${cfg.dotSize}
opacity: ${cfg.opacity}
color: "${cfg.color}"`
    navigator.clipboard.writeText(out).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [configRef])

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] w-60 rounded-xl border border-zinc-700 bg-zinc-900/95 p-4 backdrop-blur-sm"
      style={{ pointerEvents: "auto" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-amber-400 font-mono">Dots Debug</span>
        <button
          onClick={copy}
          className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-200 hover:bg-zinc-600 transition-colors"
        >
          {copied ? "Copied!" : "Copy config"}
        </button>
      </div>

      <Slider label="Float amplitude" value={vals.floatAmp} min={0} max={0.5} step={0.005} onChange={v => set("floatAmp", v)} />
      <Slider label="Float speed" value={vals.floatSpeed} min={0} max={2} step={0.01} onChange={v => set("floatSpeed", v)} />
      <Slider label="Spring" value={vals.spring} min={0} max={0.1} step={0.001} onChange={v => set("spring", v)} />
      <Slider label="Damping" value={vals.damping} min={0.5} max={0.99} step={0.01} onChange={v => set("damping", v)} />
      <Slider label="Repel strength" value={vals.repelStrength} min={0} max={0.05} step={0.001} onChange={v => set("repelStrength", v)} />
      <Slider label="Repel radius" value={vals.repelRadiusRatio} min={0} max={0.5} step={0.01} onChange={v => set("repelRadiusRatio", v)} />
      <Slider label="Dot size (px)" value={vals.dotSize} min={0.5} max={6} step={0.1} onChange={v => set("dotSize", v)} />
      <Slider label="Opacity" value={vals.opacity} min={0} max={1} step={0.01} onChange={v => set("opacity", v)} />

      <label className="flex flex-col gap-0.5 mt-1">
        <span className="text-[10px] text-zinc-300">Color</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={vals.color}
            onChange={e => set("color", e.target.value)}
            className="h-6 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <span className="font-mono text-[10px] text-amber-300">{vals.color}</span>
        </div>
      </label>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function BackgroundDots() {
  const configRef = useRef<DotsConfig>({ ...DEFAULT_CONFIG })

  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
          dpr={[1, 1.5]}
        >
          <DotsField configRef={configRef} />
        </Canvas>
      </div>
      <DebugPanel configRef={configRef} />
    </>
  )
}
