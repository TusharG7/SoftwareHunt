import React from 'react';

export default function ReviewsSection({ software }: { software: any }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Reviews</h2>
      {software.softwareHuntReview.length ? (
        software.softwareHuntReview.map((review: any, idx: number) => (
          <div key={idx} className="p-4 border rounded-md">
            <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
            <p className="text-right text-sm text-gray-500">- {review.user}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </section>
  );
}
