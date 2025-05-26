import React from 'react';

export default function PricingSection({ software }: { software: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Pricing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {software.pricing_tiers.map((plan: any, idx: number) => (
          <div key={idx} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <p className="text-blue-600 text-xl font-semibold">{plan.price}</p>
            <ul className="text-sm mt-2 text-gray-600 list-disc list-inside">
              {plan.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
