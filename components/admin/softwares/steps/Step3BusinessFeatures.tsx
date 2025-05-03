"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "@/components/admin/multi-select"
import { fetchBusinessNeedsOptions } from "@/controllers/business-needs.controller"
import { fetchPainPointsOptions } from "@/controllers/painPoints.controller"
import { fetchFeaturesOptions } from "@/controllers/features.controller"

export default function Step3BusinessFeatures({
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
  const [addingField, setAddingField] = useState<"business_needs" | "pain_points" | "key_features" | null>(null)
  const [newName, setNewName] = useState("")
  const [associations, setAssociations] = useState<string[]>([])

  const [businessNeeds, setBusinessNeeds] = useState<{ businessNeedsId: string, name: string }[]>([])
  const [painPoints, setPainPoints] = useState<{ painPointId: string, name: string, businessNeedsId: string }[]>([])
  const [features, setFeatures] = useState<{ featureId: string, name: string, businessNeedsId: string }[]>([])

  // Track newly added business needs
  const [newBusinessNeeds, setNewBusinessNeeds] = useState<{ businessNeedsId: string, name: string }[]>([])

  useEffect(() => {
    async function loadOptions() {
      const bnRes = await fetchBusinessNeedsOptions()
      if (bnRes.businessNeeds) setBusinessNeeds(bnRes.businessNeeds)

      const ppRes = await fetchPainPointsOptions()
      if (ppRes.painPoints) setPainPoints(ppRes.painPoints)

      const fRes = await fetchFeaturesOptions()
      if (fRes.features) setFeatures(fRes.features)
    }
    loadOptions()
  }, [])

  // Combine database and newly added business needs
  const allBusinessNeeds = [...businessNeeds, ...newBusinessNeeds]

  const handleAdd = (key: string) => {
    if (!newName) return

    if (key === "business_needs") {
      // Add to newBusinessNeeds when adding a new business need
      const newBusinessNeed = {
        businessNeedsId: `new_${Date.now()}`, // Temporary ID for new items
        name: newName
      }
      setNewBusinessNeeds([...newBusinessNeeds, newBusinessNeed])
    }

    const payload = { name: newName, associations }
    setFormData((prev: any) => ({
      ...prev,
      [key]: [...(prev[key] || []), payload],
    }))
    setAddingField(null)
    setNewName("")
    setAssociations([])
  }

  const handleRemove = (key: string, itemName: string) => {
    if (key === "business_needs") {
      // Also remove from newBusinessNeeds if it was a newly added item
      setNewBusinessNeeds(newBusinessNeeds.filter(bn => bn.name !== itemName))
    }
    setFormData((prev: any) => ({
      ...prev,
      [key]: prev[key].filter((item: any) => item.name !== itemName),
    }))
  }

  return (
    <div className="flex flex-col mt-3">
      <h2 className="text-lg font-semibold">Step 3: Business Needs, Pain Points & Features</h2>

      {/* --- BUSINESS NEEDS --- */}
      <div className="flex flex-col gap-3 mt-4">
        <Label>Business Needs</Label>

        <MultiSelect
          options={allBusinessNeeds.map(bn => ({ label: bn.name, value: bn.businessNeedsId }))}
          selectedValues={(formData.business_needs || []).map((item: any) => {
            // Find the business need by name to get its ID for the select component
            const found = allBusinessNeeds.find(bn => bn.name === item.name);
            return found ? found.businessNeedsId : item.name;
          })}
          onChange={(selectedIds: string[]) => {
            // Map selected IDs back to names for storage
            const selectedNames = selectedIds.map(id => {
              const found = allBusinessNeeds.find(bn => bn.businessNeedsId === id);
              return found ? found.name : id;
            });
            setFormData((prev: any) => ({
              ...prev,
              business_needs: selectedNames.map(name => ({ name, associations: [] })),
            }));
          }}
          placeholder="Select Business Needs..."
        />

        <Button variant="outline" onClick={() => setAddingField("business_needs")}>
          + Add New Business Need
        </Button>

        {addingField === "business_needs" && (
          <div className="flex flex-col gap-2 mt-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Business Need..." />
            <Button className="mt-2" onClick={() => handleAdd("business_needs")}>
              Save Business Need
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {(formData.business_needs || []).map((need: any) => (
            <Badge key={need.name} onClick={() => handleRemove("business_needs", need.name)} variant="secondary" className="cursor-pointer">
              {need.name} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* --- PAIN POINTS --- */}
      <div className="flex flex-col gap-3 mt-3">
        <Label>Pain Points</Label>

        <MultiSelect
          options={painPoints.map(pp => ({ label: pp.name, value: pp.painPointId }))}
          selectedValues={(formData.pain_points || []).map((item: any) => {
            // Find the pain point by name to get its ID for the select component
            const found = painPoints.find(pp => pp.name === item.name);
            return found ? found.painPointId : item.name;
          })}
          onChange={(selectedIds: string[]) => {
            // Map selected IDs back to names for storage
            const selectedNames = selectedIds.map(id => {
              const found = painPoints.find(pp => pp.painPointId === id);
              return found ? found.name : id;
            });
            setFormData((prev: any) => ({
              ...prev,
              pain_points: selectedNames.map(name => ({ name, associations: [] })),
            }));
          }}
          placeholder="Select Pain Points..."
        />

        <Button variant="outline" onClick={() => setAddingField("pain_points")}>
          + Add New Pain Point
        </Button>

        {addingField === "pain_points" && (
          <div className="flex flex-col gap-2 mt-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Pain Point..." />
            <Label>Select Associated Business Needs</Label>
            <MultiSelect
              options={allBusinessNeeds.map(bn => ({ label: bn.name, value: bn.businessNeedsId }))}
              selectedValues={associations}
              onChange={setAssociations}
              placeholder="Select Business Needs..."
            />
            <Button className="mt-2" onClick={() => handleAdd("pain_points")}>
              Save Pain Point
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {(formData.pain_points || []).map((pain: any) => (
            <Badge key={pain.name} onClick={() => handleRemove("pain_points", pain.name)} variant="secondary" className="cursor-pointer">
              {pain.name} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* --- KEY FEATURES --- */}
      <div className="flex flex-col gap-3 mt-6">
        <Label>Key Features</Label>

        <MultiSelect
          options={features.map(f => ({ label: f.name, value: f.featureId }))}
          selectedValues={(formData.key_features || []).map((item: any) => {
            // Find the feature by name to get its ID for the select component
            const found = features.find(f => f.name === item.name);
            return found ? found.featureId : item.name;
          })}
          onChange={(selectedIds: string[]) => {
            // Map selected IDs back to names for storage
            const selectedNames = selectedIds.map(id => {
              const found = features.find(f => f.featureId === id);
              return found ? found.name : id;
            });
            setFormData((prev: any) => ({
              ...prev,
              key_features: selectedNames.map(name => ({ name, associations: [] })),
            }));
          }}
          placeholder="Select Features..."
        />

        <Button variant="outline" onClick={() => setAddingField("key_features")}>
          + Add New Key Feature
        </Button>

        {addingField === "key_features" && (
          <div className="flex flex-col gap-2 mt-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Key Feature..." />
            <Label>Select Associated Business Needs</Label>
            <MultiSelect
              options={allBusinessNeeds.map(bn => ({ label: bn.name, value: bn.businessNeedsId }))}
              selectedValues={associations}
              onChange={setAssociations}
              placeholder="Select Business Needs..."
            />
            <Button className="mt-2" onClick={() => handleAdd("key_features")}>
              Save Key Feature
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {(formData.key_features || []).map((feat: any) => (
            <Badge key={feat.name} onClick={() => handleRemove("key_features", feat.name)} variant="secondary" className="cursor-pointer">
              {feat.name} ✕
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
