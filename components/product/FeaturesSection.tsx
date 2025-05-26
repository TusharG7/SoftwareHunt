import React from 'react';

export default function FeaturesSection({ software }: { software: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Features</h2>
      <ul className="list-disc list-inside text-gray-700">
        {software.features.map((feature: string, idx: number) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
    </section>
  );
}
