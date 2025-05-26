import React from 'react';

export default function TestimonialsSection({ software }: { software: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Testimonials</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {software.testimonies.map((testimonial: any, idx: number) => (
          <div key={idx} className="border p-4 rounded-md shadow">
            <p className="italic text-gray-700">"{testimonial.text}"</p>
            <p className="text-right font-medium text-sm mt-2">— {testimonial.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
