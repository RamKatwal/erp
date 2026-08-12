import type { SVGProps } from "react"

export function DuoPermissionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" {...props}>
      <g>
        <path
          fill="currentColor"
          fillOpacity="0.28"
          d="M7 1.5 12.5 4v3.2c0 3.2-2.3 5.4-5.5 6.3-3.2-.9-5.5-3.1-5.5-6.3V4L7 1.5Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M7 1.5 12.5 4v3.2c0 3.2-2.3 5.4-5.5 6.3-3.2-.9-5.5-3.1-5.5-6.3V4L7 1.5Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="m5 7 1.5 1.5L9.5 5.5"
        />
      </g>
    </svg>
  )
}
