"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const DOT_COUNT = 2500
const CFG = {
  floatAmp: 0.08,
  floatSpeed: 0.68,
  spring: 0.002,
  damping: 0.79,
  repelStrength: 0.016,
  repelRadiusRatio: 0.23,
  dotSize: 1.7,
  opacity: 0.61,
  color: "#d95000",
}

function DotsField() {
  const { viewport, camera } = useThree()
  const pointsRef = useRef<THREE.Points>(null!)
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
    const t = clock.getElapsedTime()
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array
    const mx = mouse.current.x
    const my = mouse.current.y
    const repelR = viewport.width * CFG.repelRadiusRatio
    const repelRSq = repelR * repelR

    for (let i = 0; i < DOT_COUNT; i++) {
      const i3 = i * 3
      const i2 = i * 2
      const tx = initPos[i3] + Math.sin(t * CFG.floatSpeed + seeds[i2]) * CFG.floatAmp
      const ty = initPos[i3 + 1] + Math.cos(t * CFG.floatSpeed * 0.8 + seeds[i2 + 1]) * CFG.floatAmp
      const dx = arr[i3] - mx
      const dy = arr[i3 + 1] - my
      const dSq = dx * dx + dy * dy
      if (dSq < repelRSq && dSq > 0.0001) {
        const d = Math.sqrt(dSq)
        const force = (1 - d / repelR) * CFG.repelStrength
        vel[i2] += (dx / d) * force
        vel[i2 + 1] += (dy / d) * force
      }
      vel[i2] += (tx - arr[i3]) * CFG.spring
      vel[i2 + 1] += (ty - arr[i3 + 1]) * CFG.spring
      vel[i2] *= CFG.damping
      vel[i2 + 1] *= CFG.damping
      arr[i3] += vel[i2]
      arr[i3 + 1] += vel[i2 + 1]
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        color={CFG.color}
        size={CFG.dotSize}
        sizeAttenuation={false}
        transparent
        opacity={CFG.opacity}
      />
    </points>
  )
}

export default function BackgroundDots() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <DotsField />
      </Canvas>
    </div>
  )
}
