import type { SVGProps } from "react"

export function DuoConfigurationsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" {...props}>
      <g>
        <path
          fill="currentColor"
          fillOpacity="0.28"
          d="M2 2.5h4v4H2v-4ZM8 7.5h4v4H8v-4Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M2 2.5h4v4H2v-4ZM8 2.5h4M10 2.5v4M2 9.5h4M4 7.5v4M8 7.5h4v4H8v-4Z"
        />
      </g>
    </svg>
  )
}
