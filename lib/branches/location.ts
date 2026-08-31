import type { Branch } from "@/types/branch"

/**
 * Infer a friendly location/address string from branch name or code if explicit address is absent.
 */
export function inferBranchLocation(name: string, code: string = ""): string {
  const combined = `${name} ${code}`.toLowerCase()
  if (combined.includes("pokhara") || combined.includes("pkr")) return "Lakeside, Pokhara"
  if (combined.includes("lalitpur") || combined.includes("ltp") || combined.includes("patan")) return "Pulchowk, Lalitpur"
  if (combined.includes("bhaktapur") || combined.includes("bkt")) return "Suryabinayak, Bhaktapur"
  if (combined.includes("biratnagar") || combined.includes("brt")) return "Main Road, Biratnagar"
  if (combined.includes("birgunj") || combined.includes("brg")) return "Adarshnagar, Birgunj"
  if (combined.includes("butwal") || combined.includes("btl")) return "Traffic Chowk, Butwal"
  if (combined.includes("dharan") || combined.includes("drn")) return "Bhanuchowk, Dharan"
  if (combined.includes("chitwan") || combined.includes("narayangarh") || combined.includes("ctw")) return "Narayangarh, Chitwan"
  if (combined.includes("nepalgunj") || combined.includes("npj")) return "Dhamboji, Nepalgunj"
  if (combined.includes("hetauda") || combined.includes("htd")) return "Main Road, Hetauda"
  if (combined.includes("thamel")) return "Thamel, Kathmandu"
  if (combined.includes("kalimati")) return "Kalimati, Kathmandu"
  if (combined.includes("baneshwor")) return "New Baneshwor, Kathmandu"
  if (
    combined.includes("head office") ||
    combined.includes("headoffice") ||
    combined.includes("hq") ||
    combined.includes("central") ||
    combined.includes("kathmandu") ||
    combined.includes("ktm")
  ) {
    return "Durbar Marg, Kathmandu"
  }
  return name.trim() || "Main Location"
}

/**
 * Get branch location with clean fallback to inferred location.
 */
export function getBranchLocation(
  branch?: Pick<Branch, "name" | "code"> & { address?: string | null } | null
): string {
  if (!branch) return ""
  if (branch.address?.trim()) return branch.address.trim()
  return inferBranchLocation(branch.name, branch.code ?? "")
}
