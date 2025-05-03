import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

const ratingFields = [
  "ease_of_use",
  "scalability",
  "budget_friendly",
  "customer_support",
  "integration_flexibility",
]

const ratingLabels: Record<string, string> = {
  ease_of_use: "Ease of Use",
  scalability: "Scalability",
  budget_friendly: "Budget Friendliness",
  customer_support: "Customer Support",
  integration_flexibility: "Integration/Customisability",
}

export default function Step6SoftwareHuntReview({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any
  setFormData: (val: any) => void
  onNext: () => void
  onBack: () => void
}) {
  const [review, setReview] = useState(
    formData.softwareHuntReview || {
      what_we_think: "",
      pros: "",
      cons: "",
      ratings: {
        ease_of_use: 0,
        scalability: 0,
        budget_friendly: 0,
        customer_support: 0,
        integration_flexibility: 0
      },
    }
  )

  const setRating = (field: string, value: number) => {
    setReview((prev:any) => ({
      ...prev,
      ratings: { ...prev.ratings, [field]: value },
    }))
  }

  const handleContinue = () => {
    setFormData((prev: any) => ({
      ...prev,
      softwareHuntReview: review,
    }))
    onNext()
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Step 6: SoftwareHunt Review</h2>

      <div>
        <Label>What We Think</Label>
        <Textarea
          value={review.what_we_think}
          onChange={(e) => setReview({ ...review, what_we_think: e.target.value })}
        />
      </div>
      <div>
        <Label>Pros</Label>
        <Textarea
          value={review.pros}
          onChange={(e) => setReview({ ...review, pros: e.target.value })}
        />
      </div>

      <div>
        <Label>Cons</Label>
        <Textarea
          value={review.cons}
          onChange={(e) => setReview({ ...review, cons: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold mt-4">Rate the Software</h3>
        {ratingFields.map((field) => (
          <div key={field} className="flex items-center gap-2">
            <Label>{ratingLabels[field]}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`cursor-pointer ${
                    review.ratings[field] >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => setRating(field, star)}
                  fill={review.ratings[field] >= star ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>Next</Button>
      </div>
    </div>
  )
}
