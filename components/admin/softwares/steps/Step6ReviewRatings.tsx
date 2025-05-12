import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Input } from "@/components/ui/input"

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

export default function Step6ReviewRatings({
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
  const [pros, setPros] = useState<string[]>(formData.pros || []);
  const [cons, setCons] = useState<string[]>(formData.cons || []);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [ratings, setRatings] = useState(formData.ratings || {
    ease_of_use: 0,
    scalability: 0,
    budget_friendly: 0,
    customer_support: 0,
    integration_flexibility: 0
  });

  const handleAddPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()]);
      setNewPro("");
    }
  };

  const handleAddCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()]);
      setNewCon("");
    }
  };

  const handleRemovePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const handleRemoveCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'pro' | 'con') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'pro') {
        handleAddPro();
      } else {
        handleAddCon();
      }
    }
  };

  const setRating = (field: string, value: number) => {
    setRatings((prev:any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContinue = () => {
    setFormData((prev: any) => ({
      ...prev,
      softwareHuntReview: {
        pros,
        cons,
        what_we_think: formData.softwareHuntReview.what_we_think,
        ratings: {
          ease_of_use: ratings.ease_of_use,
          scalability: ratings.scalability,
          budget_friendly: ratings.budget_friendly,
          customer_support: ratings.customer_support,
          integration_flexibility: ratings.integration_flexibility
        }
      }
    }));
    onNext();
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Step 6: Review & Ratings</h2>

      <div className="flex flex-col gap-3">
        <Label>Pros</Label>
        <div className="flex flex-col gap-2">
          {pros.map((pro, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 p-2 text-sm rounded-md border">
                {pro}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => handleRemovePro(index)}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newPro}
              onChange={(e) => setNewPro(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'pro')}
              placeholder="Add a pro..."
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleAddPro}
              disabled={!newPro.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Cons</Label>
        <div className="flex flex-col gap-2">
          {cons.map((con, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 p-2 text-sm rounded-md border">
                {con}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => handleRemoveCon(index)}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newCon}
              onChange={(e) => setNewCon(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'con')}
              placeholder="Add a con..."
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleAddCon}
              disabled={!newCon.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>What We Think</Label>
        <Textarea
          value={formData.softwareHuntReview?.what_we_think || ''}
          onChange={(e) => setFormData((prev: any) => ({
            ...prev,
            softwareHuntReview: {
              ...prev.softwareHuntReview,
              what_we_think: e.target.value
            }
          }))}
          className="bg-white"
          placeholder="Enter your thoughts..."
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
                    ratings[field] >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => setRating(field, star)}
                  fill={ratings[field] >= star ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>Next</Button>
      </div>
    </div>
  )
}
