import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchFeaturesOptions } from "@/controllers/features.controller"

type PricingTier = {
  tierName: string
  price: string
  duration: string
  maxUsers: string
  features: string[]
}

export default function Step4Pricing({
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
  const [isFree, setIsFree] = useState(formData.isFree || false)
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(formData.pricingTiers || [])
  const [features, setFeatures] = useState<{ featureId: string, name: string }[]>([])

  useEffect(() => {
    async function loadFeatures() {
      const res = await fetchFeaturesOptions()
      if (res.features) setFeatures(res.features)
    }
    loadFeatures()
  }, [])

  // Get newly added features from Step 3
  const newFeatures = (formData.key_features || [])
    .filter((feature: any) => typeof feature === 'object' && feature.name)
    .map((feature: any) => ({
      featureId: `new_${feature.name}`,
      name: feature.name
    }))

  // Deduplicate by name, prefer DB feature if exists
  const featureMap = new Map();
  [...features, ...newFeatures].forEach(f => {
    if (!featureMap.has(f.name)) {
      featureMap.set(f.name, f);
    }
  });
  const allFeatures = Array.from(featureMap.values());
  const availableFeatures = allFeatures.map(f => ({ label: f.name, value: f.featureId }));

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
    const newTiers = [...pricingTiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setPricingTiers(newTiers)
  }

  const toggleFeatureInTier = (tierIndex: number, feature: string) => {
    const newTiers = [...pricingTiers]
    const tier = newTiers[tierIndex]
    const featureIndex = tier.features.indexOf(feature)
    
    if (featureIndex === -1) {
      tier.features.push(feature)
    } else {
      tier.features.splice(featureIndex, 1)
    }
    
    setPricingTiers(newTiers)
  }

  const handleNext = () => {
    setFormData((prev: any) => ({
      ...prev,
      is_free:isFree,
      pricing_tiers: isFree ? [] : pricingTiers,
    }))
    onNext()
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
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={tier.price}
                    onChange={(e) => handleTierChange(index, "price", e.target.value)}
                    placeholder="e.g., 99"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Duration</Label>
                  <Input
                    value={tier.duration}
                    onChange={(e) => handleTierChange(index, "duration", e.target.value)}
                    placeholder="e.g., per month, per year"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Max Users</Label>
                  <Input
                    type="number"
                    value={tier.maxUsers}
                    onChange={(e) => handleTierChange(index, "maxUsers", e.target.value)}
                    placeholder="e.g., 5, 10, unlimited"
                  />
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
