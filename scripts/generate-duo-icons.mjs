import fs from "node:fs"
import path from "node:path"

const srcDir = path.resolve("public/icons/duo")
const outDir = path.resolve("components/icons/duo")

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(srcDir).filter((file) => file.endsWith(".svg"))
const names = []

for (const file of files) {
  const kebab = file.replace(/\.svg$/, "")
  const pascal = kebab
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("")
  const compName = `Duo${pascal}Icon`
  let svg = fs.readFileSync(path.join(srcDir, file), "utf8")

  svg = svg.replace(/<svg([^>]*)>/, "<svg$1 {...props}>")
  svg = svg.replace(/<desc>[\s\S]*?<\/desc>\s*/g, "")
  svg = svg.replace(/ id="[^"]+"/g, "")

  // Normalize Streamline blue duotone -> black duotone via currentColor.
  // Light fill becomes a faded tone, dark stroke becomes full currentColor,
  // and the white knockout layer becomes transparent for a clean two-tone look.
  svg = svg.replace(/fill="#d7e0ff"/gi, 'fill="currentColor" fill-opacity="0.28"')
  svg = svg.replace(/fill="#ffffff"/gi, 'fill="none"')
  svg = svg.replace(/#4147d5/gi, "currentColor")
  svg = svg.replace(/#d7e0ff/gi, "currentColor")

  const content = `import type { SVGProps } from "react"

export function ${compName}(props: SVGProps<SVGSVGElement>) {
  return (
    ${svg.trim()}
  )
}
`

  fs.writeFileSync(path.join(outDir, `${kebab}.tsx`), content)
  names.push({ kebab, compName })
}

const index = names
  .sort((a, b) => a.kebab.localeCompare(b.kebab))
  .map((entry) => `export { ${entry.compName} } from "./${entry.kebab}"`)
  .join("\n")

fs.writeFileSync(path.join(outDir, "index.ts"), `${index}\n`)
console.log(`generated ${names.length} icons`)
