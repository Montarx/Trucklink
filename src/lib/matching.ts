import type { Coordinates, FreightMatch, FreightRequest, TruckRoute } from "@/src/domain/logistics";

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceKm(a: Coordinates, b: Coordinates) {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function routeDetourScore(route: TruckRoute, freight: FreightRequest) {
  const direct = distanceKm(route.origin.coordinates, route.destination.coordinates);
  const withFreight =
    distanceKm(route.origin.coordinates, freight.pickup.coordinates) +
    distanceKm(freight.pickup.coordinates, freight.delivery.coordinates) +
    distanceKm(freight.delivery.coordinates, route.destination.coordinates);

  const detour = Math.max(0, withFreight - direct);
  const maxUsefulDetourKm = Math.max(35, direct * 0.18);

  return Math.max(0, Math.round(100 * (1 - detour / maxUsefulDetourKm)));
}

function dateScore(route: TruckRoute, freight: FreightRequest) {
  const routeDate = new Date(`${route.departureDate}T00:00:00Z`).getTime();
  const pickupDate = new Date(`${freight.pickupDate}T00:00:00Z`).getTime();
  const days = Math.abs(routeDate - pickupDate) / 86_400_000;

  if (days === 0) return 100;
  if (days <= 1) return 70;
  if (days <= 2) return 35;
  return 0;
}

export function scoreMatch(route: TruckRoute, freight: FreightRequest): FreightMatch {
  const enoughWeight = route.availableWeightKg >= freight.weightKg;
  const enoughPallets = route.availablePallets >= freight.pallets;

  const breakdown = {
    routeFit: routeDetourScore(route, freight),
    dateFit: dateScore(route, freight),
    weightFit: enoughWeight ? 100 : 0,
    capacityFit: enoughPallets ? 100 : 0,
  };

  const eligible = enoughWeight && enoughPallets && breakdown.dateFit > 0 && breakdown.routeFit > 0;
  const weightedScore =
    breakdown.routeFit * 0.5 +
    breakdown.dateFit * 0.2 +
    breakdown.weightFit * 0.15 +
    breakdown.capacityFit * 0.15;

  return {
    truckRouteId: route.id,
    freightRequestId: freight.id,
    score: eligible ? Math.round(weightedScore) : 0,
    breakdown,
    eligible,
  };
}
