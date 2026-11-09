export function summarizeUnits(units: { status: string; annual_rent: number | null }[]) {
  const count = (s: string) => units.filter((u) => u.status === s).length;
  const total = units.length;
  const rented = count("rented");
  return {
    total,
    rented,
    vacant: count("vacant"),
    maintenance: count("maintenance"),
    occupancy: total ? Math.round((rented / total) * 100) : 0,
    rentRoll: units
      .filter((u) => u.status === "rented")
      .reduce((sum, u) => sum + Number(u.annual_rent ?? 0), 0),
  };
}
