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
import { BusinessNeed, PainPoint, Feature, FormData } from '@/types/software'

interface Props {
  formData: FormData
  setFormData: (val: FormData | ((prev: FormData) => FormData)) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3BusinessFeatures({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {
  const [addingField, setAddingField] = useState<"business_needs" | "pain_points" | "key_features" | null>(null)
  const [newName, setNewName] = useState("")
  const [associations, setAssociations] = useState<string[]>([])

  const [businessNeeds, setBusinessNeeds] = useState<BusinessNeed[]>(formData.business_needs || [])
  const [painPoints, setPainPoints] = useState<PainPoint[]>(formData.pain_points || [])
  const [keyFeatures, setKeyFeatures] = useState<Feature[]>(formData.key_features || [])

  // Track newly added business needs
  const [newBusinessNeeds, setNewBusinessNeeds] = useState<BusinessNeed[]>([])

  useEffect(() => {
    async function loadOptions() {
      const bnRes = await fetchBusinessNeedsOptions()
      if (bnRes.businessNeeds) setBusinessNeeds(bnRes.businessNeeds)

      const ppRes = await fetchPainPointsOptions()
      if (ppRes.painPoints) setPainPoints(ppRes.painPoints)

      const fRes = await fetchFeaturesOptions()
      if (fRes.features) setKeyFeatures(fRes.features)
    }
    loadOptions()
  }, [])

  // Combine database and newly added business needs
  const allBusinessNeeds = [...businessNeeds, ...newBusinessNeeds]

  const handleAdd = (key: string) => {
    if (!newName) return;

    if (key === "business_needs") {
      const newBusinessNeed: BusinessNeed = {
        businessNeedsId: `new_${Date.now()}`,
        name: newName,
        associations: []
      };
      setNewBusinessNeeds([...newBusinessNeeds, newBusinessNeed]);
      setFormData((prev: FormData) => ({
        ...prev,
        business_needs: [...prev.business_needs, newBusinessNeed]
      }));
    } else if (key === "pain_points") {
      const newPainPoint: PainPoint = {
        painPointId: `new_${Date.now()}`,
        name: newName,
        businessNeedsId: '',
        associations: associations
      };
      setFormData((prev: FormData) => ({
        ...prev,
        pain_points: [...prev.pain_points, newPainPoint]
      }));
    } else if (key === "key_features") {
      const newFeature: Feature = {
        featureId: `new_${Date.now()}`,
        name: newName,
        businessNeedsId: '',
        associations: associations
      };
      setFormData((prev: FormData) => ({
        ...prev,
        key_features: [...prev.key_features, newFeature]
      }));
    }

    setAddingField(null);
    setNewName("");
    setAssociations([]);
  };

  const handleRemove = (key: string, itemName: string) => {
    if (key === "business_needs") {
      setNewBusinessNeeds(newBusinessNeeds.filter(bn => bn.name !== itemName))
    }
    
    setFormData((prev: FormData) => ({
      ...prev,
      [key]: prev[key].filter((item: any) => item.name !== itemName)
    }))
  }

  const handleBusinessNeedsChange = (selectedIds: string[]) => {
    const selectedNames = selectedIds.map(id => {
      const found = allBusinessNeeds.find(bn => bn.businessNeedsId === id)
      return found ? found.name : id
    })

    const newBusinessNeeds: BusinessNeed[] = selectedNames.map(name => ({
      businessNeedsId: `new_${name}`,
      name,
      associations: []
    }))

    setFormData((prev: FormData) => ({
      ...prev,
      business_needs: newBusinessNeeds
    }))
  }

  const handlePainPointsChange = (selectedIds: string[]) => {
    const selectedNames = selectedIds.map(id => {
      const found = painPoints.find(pp => pp.painPointId === id)
      return found ? found.name : id
    })

    const newPainPoints: PainPoint[] = selectedNames.map(name => ({
      painPointId: `new_${name}`,
      name,
      businessNeedsId: '',
      associations: []
    }))

    setFormData((prev: FormData) => ({
      ...prev,
      pain_points: newPainPoints
    }))
  }

  const handleFeaturesChange = (selectedIds: string[]) => {
    const selectedNames = selectedIds.map(id => {
      const found = keyFeatures.find(f => f.featureId === id)
      return found ? found.name : id
    })

    const newFeatures: Feature[] = selectedNames.map(name => ({
      featureId: `new_${name}`,
      name,
      businessNeedsId: '',
      associations: []
    }))

    setFormData((prev: FormData) => ({
      ...prev,
      key_features: newFeatures
    }))
  }

  return (
    <div className="flex flex-col mt-3">
      <h2 className="text-lg font-semibold">Step 3: Business Needs, Pain Points & Features</h2>

      {/* --- BUSINESS NEEDS --- */}
      <div className="flex flex-col gap-3 mt-4 bg-gray-50 border rounded-lg p-4">
        <Label>Business Needs</Label>

        <MultiSelect
          options={allBusinessNeeds.map(bn => ({ label: bn.name, value: bn.businessNeedsId }))}
          selectedValues={(formData.business_needs || []).map((item: any) => {
            // Find the business need by name to get its ID for the select component
            const found = allBusinessNeeds.find(bn => bn.name === item.name);
            return found ? found.businessNeedsId : item.name;
          })}
          onChange={handleBusinessNeedsChange}
          placeholder="Select Business Needs..."
        />

        <Button variant="outline" onClick={() => setAddingField("business_needs")}>
          + Add New Business Need
        </Button>

        {addingField === "business_needs" && (
          <div className="flex flex-col gap-2 mt-2 border p-2 bg-blue-50">
            <Input className="bg-white" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Business Need..." />
            <Button className="mt-2" onClick={() => handleAdd("business_needs")}>
              Save Business Need
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(formData.business_needs || []).map((need: any) => (
            <Badge key={need.name} onClick={() => handleRemove("business_needs", need.name)} variant="secondary" className="cursor-pointer">
              {need.name} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* --- PAIN POINTS --- */}
      <div className="flex flex-col gap-3 mt-3 bg-gray-50 border rounded-lg p-4">
        <Label>Pain Points</Label>

        <MultiSelect
          options={painPoints.map(pp => ({ label: pp.name, value: pp.painPointId }))}
          selectedValues={(formData.pain_points || []).map((item: any) => {
            // Find the pain point by name to get its ID for the select component
            const found = painPoints.find(pp => pp.name === item.name);
            return found ? found.painPointId : item.name;
          })}
          onChange={handlePainPointsChange}
          placeholder="Select Pain Points..."
        />

        <Button variant="outline" onClick={() => setAddingField("pain_points")}>
          + Add New Pain Point
        </Button>

        {addingField === "pain_points" && (
          <div className="flex flex-col gap-2 mt-2 border p-2 bg-blue-50">
            <Input className="bg-white" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Pain Point..." />
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

        <div className="flex flex-wrap gap-2">
          {(formData.pain_points || []).map((pain: any) => (
            <Badge key={pain.name} onClick={() => handleRemove("pain_points", pain.name)} variant="secondary" className="shadow cursor-pointer">
              {pain.name} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* --- KEY FEATURES --- */}
      <div className="flex flex-col gap-3 mt-3 bg-gray-50 border rounded-lg p-4">
        <Label>Key Features</Label>

        <MultiSelect
          options={keyFeatures.map(f => ({ label: f.name, value: f.featureId }))}
          selectedValues={(formData.key_features || []).map((item: any) => {
            // Find the feature by name to get its ID for the select component
            const found = keyFeatures.find(f => f.name === item.name);
            return found ? found.featureId : item.name;
          })}
          onChange={handleFeaturesChange}
          placeholder="Select Features..."
        />

        <Button variant="outline" onClick={() => setAddingField("key_features")}>
          + Add New Key Feature
        </Button>

        {addingField === "key_features" && (
          <div className="flex flex-col gap-2 mt-2 border p-2 bg-blue-50">
            <Input className="bg-white" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Key Feature..." />
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
