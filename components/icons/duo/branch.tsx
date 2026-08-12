import type { SVGProps } from "react"

export function DuoBranchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" {...props}>
      <g>
        <path
          fill="currentColor"
          fillOpacity="0.28"
          d="M2.5 1.5h4v4h-4v-4ZM7.5 8.5h4v4h-4v-4Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M4.5 5.5v2a2 2 0 0 0 2 2h1M2.5 1.5h4v4h-4v-4ZM7.5 8.5h4v4h-4v-4Z"
        />
      </g>
    </svg>
  )
}
