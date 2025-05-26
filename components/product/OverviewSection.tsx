import React from 'react';

export default function OverviewSection({ software }: { software: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Overview</h2>
      <p className="text-gray-700">{software.description}</p>
    </section>
  );
}
