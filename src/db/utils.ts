export type HasId = { id: number }

export const uuid = <T extends Array<HasId>>(arr: T) => {
  if (!arr.length) return 1
  const max = Math.max(...arr.map((x) => x.id))
  return max + 1
}
