export type Coordinates = {
  lat: number;
  lng: number;
};

export type LocationPoint = {
  label: string;
  coordinates: Coordinates;
};

export type TruckRoute = {
  id: string;
  carrierId: string;
  origin: LocationPoint;
  destination: LocationPoint;
  departureDate: string;
  availableWeightKg: number;
  availablePallets: number;
};

export type FreightRequest = {
  id: string;
  shipperId: string;
  pickup: LocationPoint;
  delivery: LocationPoint;
  pickupDate: string;
  weightKg: number;
  pallets: number;
};

export type MatchBreakdown = {
  routeFit: number;
  dateFit: number;
  weightFit: number;
  capacityFit: number;
};

export type FreightMatch = {
  truckRouteId: string;
  freightRequestId: string;
  score: number;
  breakdown: MatchBreakdown;
  eligible: boolean;
};
