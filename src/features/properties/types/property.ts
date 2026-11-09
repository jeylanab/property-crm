export type PropertySummary = {
  id: string;
  name: string;
  emirate: string;
  area: string | null;
  propertyType: string;
  ownerName: string | null;
  total: number;
  rented: number;
  vacant: number;
  maintenance: number;
  occupancy: number; // 0-100
  rentRoll: number;  // AED per year from rented units
};

export type UnitDetail = {
  id: string;
  unitNumber: string;
  bedrooms: number | null;
  sizeSqft: number | null;
  annualRent: number | null;
  status: "vacant" | "rented" | "maintenance";
  tenantName: string | null;
};

export type PropertyDetail = {
  id: string;
  name: string;
  emirate: string;
  area: string | null;
  address: string | null;
  propertyType: string;
  ownerName: string | null;
};
