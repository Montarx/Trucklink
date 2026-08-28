import { scoreMatch } from "@/src/lib/matching";
import type { FreightRequest, TruckRoute } from "@/src/domain/logistics";

const route: TruckRoute = {
  id: "route-ath-thess",
  carrierId: "carrier-demo",
  origin: { label: "Athens", coordinates: { lat: 37.9838, lng: 23.7275 } },
  destination: { label: "Thessaloniki", coordinates: { lat: 40.6401, lng: 22.9444 } },
  departureDate: "2026-08-30",
  availableWeightKg: 1500,
  availablePallets: 2,
};

const freight: FreightRequest = {
  id: "freight-lamia-thess",
  shipperId: "shipper-demo",
  pickup: { label: "Lamia", coordinates: { lat: 38.8992, lng: 22.4333 } },
  delivery: { label: "Thessaloniki", coordinates: { lat: 40.6401, lng: 22.9444 } },
  pickupDate: "2026-08-30",
  weightKg: 500,
  pallets: 1,
};

export default function Home() {
  const match = scoreMatch(route, freight);

  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">GREEN LOGISTICS · GREECE</span>
        <h1>Fill the miles already being driven.</h1>
        <p className="lead">
          TruckLink finds freight that fits routes trucks are already planning to drive — reducing empty capacity,
          transport cost and avoidable emissions.
        </p>
        <div className="actions">
          <button>Post a truck route</button>
          <button className="secondary">Post freight</button>
        </div>
      </section>

      <section className="demo" aria-label="Example automatic match">
        <div className="demoHeader">
          <div>
            <span className="eyebrow">LIVE MVP CONCEPT</span>
            <h2>Automatic route match</h2>
          </div>
          <div className="score">
            <strong>{match.score}%</strong>
            <span>match score</span>
          </div>
        </div>

        <div className="grid">
          <article className="card">
            <span>Truck route</span>
            <h3>{route.origin.label} → {route.destination.label}</h3>
            <p>{route.departureDate} · {route.availablePallets} pallets · {route.availableWeightKg.toLocaleString()} kg free</p>
          </article>
          <article className="card">
            <span>Freight request</span>
            <h3>{freight.pickup.label} → {freight.delivery.label}</h3>
            <p>{freight.pickupDate} · {freight.pallets} pallet · {freight.weightKg.toLocaleString()} kg</p>
          </article>
        </div>

        <div className="breakdown">
          <Metric label="Route fit" value={match.breakdown.routeFit} />
          <Metric label="Date fit" value={match.breakdown.dateFit} />
          <Metric label="Weight fit" value={match.breakdown.weightFit} />
          <Metric label="Capacity fit" value={match.breakdown.capacityFit} />
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}%</strong>
    </div>
  );
}
