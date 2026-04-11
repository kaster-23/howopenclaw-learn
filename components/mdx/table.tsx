import type { HTMLAttributes } from "react"

export function Table(props: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  )
}
