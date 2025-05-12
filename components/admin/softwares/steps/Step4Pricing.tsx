import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchFeaturesOptions } from "@/controllers/features.controller"
import { FormData, SetFormData, PricingTier } from '@/types/software'

interface Props {
  formData: FormData
  setFormData: SetFormData
  onNext: () => void
  onBack: () => void
}

const DURATION_OPTIONS = [
  { value: "per month", label: "Per Month" },
  { value: "per year", label: "Per Year" },
  { value: "per quarter", label: "Per Quarter" },
  { value: "per week", label: "Per Week" },
  { value: "one-time", label: "One Time" },
  { value: "per user per month", label: "Per User Per Month" },
  { value: "per user per year", label: "Per User Per Year" }
];

const CURRENCY_SYMBOL = "₹";

export default function Step4Pricing({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {
  const [isFree, setIsFree] = useState(formData.is_free || false)
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(formData.pricing_tiers || [])
  const [features, setFeatures] = useState<{ featureId: string, name: string }[]>([])

  useEffect(() => {
    async function loadFeatures() {
      const res = await fetchFeaturesOptions()
      if (res.features) setFeatures(res.features)
    }
    loadFeatures()
  }, [])

  // Only use features that were selected in Step 3
  const selectedFeatures = (formData.key_features || [])
    .map((feature: any) => ({
      featureId: feature.featureId,
      name: feature.name
    }));

  // Create options array for the badges
  const availableFeatures = selectedFeatures.map(f => ({ 
    label: f.name, 
    value: f.featureId
  }));

  const handleAddTier = () => {
    setPricingTiers([
      ...pricingTiers,
      {
        tierName: "",
        price: "",
        duration: "",
        maxUsers: "",
        features: [],
      },
    ])
  }

  const handleRemoveTier = (index: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index))
  }

  const handleTierChange = (index: number, field: keyof PricingTier, value: string) => {
    const newTiers = [...pricingTiers];
    if (field === "maxUsers") {
      // If value is "unlimited", set it directly
      // Otherwise, ensure it's a valid number
      newTiers[index] = { 
        ...newTiers[index], 
        [field]: value === "unlimited" ? "10000" : value 
      };
    } else {
      newTiers[index] = { ...newTiers[index], [field]: value };
    }
    setPricingTiers(newTiers);
  };

  const toggleFeatureInTier = (tierIndex: number, featureId: string) => {
    const newTiers = [...pricingTiers]
    const tier = newTiers[tierIndex]
    const featureIndex = tier.features.indexOf(featureId)
    
    if (featureIndex === -1) {
      tier.features.push(featureId)
    } else {
      tier.features.splice(featureIndex, 1)
    }
    
    setPricingTiers(newTiers)
  }

  const handlePricingChange = (tiers: PricingTier[]) => {
    setPricingTiers(tiers);
    setFormData((prev: FormData) => ({
      ...prev,
      pricing_tiers: tiers,
      is_free: isFree
    }));
  };

  const handleNext = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      is_free: isFree,
      pricing_tiers: isFree ? [] : pricingTiers,
    }));
    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="free"
          checked={isFree}
          onCheckedChange={setIsFree}
        />
        <Label htmlFor="free">This software is free</Label>
      </div>

      {!isFree && (
        <div className="space-y-4">
          {pricingTiers.map((tier, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Tier {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleRemoveTier(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Tier Name</Label>
                  <Input
                    value={tier.tierName}
                    onChange={(e) => handleTierChange(index, "tierName", e.target.value)}
                    placeholder="e.g., Basic, Pro, Enterprise"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Price (in Indian Rupees)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {CURRENCY_SYMBOL}
                    </span>
                    <Input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handleTierChange(index, "price", e.target.value)}
                      placeholder="e.g., 999"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All prices are in Indian Rupees (₹)
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Duration</Label>
                  <select
                    value={tier.duration}
                    onChange={(e) => handleTierChange(index, "duration", e.target.value)}
                    className="flex border py-1.5 shadow-xs appearance-none w-full rounded-md px-2 text-sm"
                  >
                    <option value="">Select duration</option>
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Max Users</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={tier.maxUsers === "unlimited" ? "" : tier.maxUsers}
                      onChange={(e) => handleTierChange(index, "maxUsers", e.target.value)}
                      placeholder="Number of users"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant={tier.maxUsers === "unlimited" ? "default" : "outline"}
                      onClick={() => handleTierChange(index, "maxUsers", "unlimited")}
                      className="whitespace-nowrap"
                    >
                      ∞
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Available Features</Label>
                <ScrollArea className="h-32 w-full rounded-md border p-2">
                  <div className="flex gap-2 flex-wrap">
                    {availableFeatures.length > 0 ? (
                      availableFeatures.map((feature) => (
                        <Badge
                          key={feature.value}
                          variant={tier.features.includes(feature.value) ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => toggleFeatureInTier(index, feature.value)}
                        >
                          {feature.label}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No features available</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddTier}
            className="w-full"
          >
            Add Pricing Tier
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
