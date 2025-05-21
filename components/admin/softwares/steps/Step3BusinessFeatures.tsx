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
import { AsyncSelectComponent as AsyncSelect } from "@/components/admin/async-select"
import { fetchPainPointsSearchOptions } from "@/controllers/painPoints.controller"
import { fetchFeaturesSearchOptions } from "@/controllers/features.controller"
import { MultiValue, SingleValue, ActionMeta } from "react-select"

interface Props {
  formData: FormData
  setFormData: (val: FormData | ((prev: FormData) => FormData)) => void
  onNext: () => void
  onBack: () => void
}

// Add this interface for the search response
interface SearchResponse {
  features?: Array<{
    featureId: string;
    name: string;
    businessNeedsId: string;
  }>;
  painPoints?: Array<{
    painPointId: string;
    name: string;
    businessNeedsId: string;
  }>;
}

// Add these interfaces at the top of the file
interface SelectOption {
  value: string;
  label: string;
  businessNeedsId?: string;
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

  // Update the load functions
  const loadPainPointOptions = async (inputValue: string): Promise<SelectOption[]> => {
    // If no input value, return all pain points
    if (!inputValue) {
      return painPoints.map((point: PainPoint) => ({
        value: point.painPointId,
        label: point.name,
        businessNeedsId: point.businessNeedsId
      }));
    }
    
    // If there's input value, search
    const response = await fetchPainPointsSearchOptions(inputValue);
    return response.painPoints?.map((point: PainPoint) => ({
      value: point.painPointId,
      label: point.name,
      businessNeedsId: point.businessNeedsId
    })) || [];
  };

  const loadFeatureOptions = async (inputValue: string): Promise<SelectOption[]> => {
    // If no input value, return all features
    if (!inputValue) {
      return keyFeatures.map((feature: Feature) => ({
        value: feature.featureId,
        label: feature.name,
        businessNeedsId: feature.businessNeedsId
      }));
    }
    
    // If there's input value, search
    const response = await fetchFeaturesSearchOptions(inputValue);
    return response.features?.map((feature: Feature) => ({
      value: feature.featureId,
      label: feature.name,
      businessNeedsId: feature.businessNeedsId
    })) || [];
  };

  const handleAdd = (key: string) => {
    if (!newName) return;
    
    // Check if business need is selected for pain points and features
    if ((key === "pain_points" || key === "key_features") && associations.length === 0) {
      alert("Please select a business need before adding a pain point or feature");
      return;
    }

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
        businessNeedsId: associations[0], // Only take the first selected business need
        associations: [associations[0]] // Store only one association
      };
      setFormData((prev: FormData) => ({
        ...prev,
        pain_points: [...prev.pain_points, newPainPoint]
      }));
    } else if (key === "key_features") {
      const newFeature: Feature = {
        featureId: `new_${Date.now()}`,
        name: newName,
        businessNeedsId: associations[0], // Only take the first selected business need
        associations: [associations[0]] // Store only one association
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

    const newPainPoints: PainPoint[] = selectedNames.map(name => {
      const existingPainPoint = formData.pain_points.find(pp => pp.name === name);
      return {
        painPointId: `new_${name}`,
        name,
        businessNeedsId: existingPainPoint?.businessNeedsId || '', // Preserve existing business need
        associations: existingPainPoint?.associations || [] // Preserve existing associations
      };
    });

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

    const newFeatures: Feature[] = selectedNames.map(name => {
      const existingFeature = formData.key_features.find(f => f.name === name);
      return {
        featureId: existingFeature?.featureId || `new_${Date.now()}`,
        name,
        businessNeedsId: existingFeature?.businessNeedsId || '',
        associations: existingFeature?.associations || []
      };
    });

    setFormData((prev: FormData) => ({
      ...prev,
      key_features: newFeatures
    }))
  }

  // Add validation before proceeding to next step
  const handleNext = () => {
    const invalidPainPoints = formData.pain_points.some(pp => !pp.businessNeedsId);
    const invalidFeatures = formData.key_features.some(f => !f.businessNeedsId);

    // if (invalidPainPoints || invalidFeatures) {
    //   alert("Please ensure all pain points and features are associated with a business need");
    //   return;
    // }

    onNext();
  };

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
            <Badge key={need.name} onClick={() => handleRemove("business_needs", need.name)} variant="active" className="cursor-pointer ">
              {need.name} <span className="ml-2 pl-2 border-l text-red-500">✕</span> 
            </Badge>
          ))}
        </div>
      </div>

      {/* --- PAIN POINTS --- */}
      <div className="flex flex-col gap-3 mt-3 bg-gray-50 border rounded-lg p-4">
        <Label>Pain Points</Label>

        <AsyncSelect
          isMulti
          loadOptions={loadPainPointOptions}
          onChange={(newValue: MultiValue<SelectOption> | SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
            if (!newValue) return;
            
            const selectedOptions = Array.isArray(newValue) ? newValue : [newValue];
            const newPainPoints = selectedOptions.map((option) => ({
              painPointId: option.value,
              name: option.label,
              businessNeedsId: option.businessNeedsId || '',
              associations: option.businessNeedsId ? [option.businessNeedsId] : []
            }));
            setFormData(prev => ({
              ...prev,
              pain_points: newPainPoints
            }));
          }}
          value={formData.pain_points?.map(point => ({
            value: point.painPointId,
            label: point.name,
            businessNeedsId: point.businessNeedsId
          }))}
          placeholder="Select pain points..."
        />

        <Button variant="outline" onClick={() => setAddingField("pain_points")}>
          + Add New Pain Point
        </Button>

        {addingField === "pain_points" && (
          <div className="flex flex-col gap-2 mt-2 border p-2 bg-blue-50">
            <Input 
              className="bg-white" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              placeholder="New Pain Point..." 
            />
            <Label className="text-red-500">* Select Associated Business Need (Required)</Label>
            <MultiSelect
              options={allBusinessNeeds.map(bn => ({ label: bn.name, value: bn.businessNeedsId }))}
              selectedValues={associations}
              onChange={(values) => setAssociations(values.slice(0, 1))} // Only allow one selection
              placeholder="Select Business Need..."
            />
            <Button 
              className="mt-2" 
              onClick={() => handleAdd("pain_points")}
              disabled={!newName || associations.length === 0}
            >
              Save Pain Point
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(formData.pain_points || []).map((pain: any) => (
            <Badge 
              key={pain.name} 
              onClick={() => handleRemove("pain_points", pain.name)} 
              variant="active" 
              className="shadow cursor-pointer"
            >
              {pain.name}
              {pain.businessNeedsId && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({allBusinessNeeds.find(bn => bn.businessNeedsId === pain.businessNeedsId)?.name})
                </span>
              )}
              <span className="ml-2 pl-2 border-l text-red-500">✕</span> 
            </Badge>
          ))}
        </div>
      </div>

      {/* --- KEY FEATURES --- */}
      <div className="flex flex-col gap-3 mt-3 bg-gray-50 border rounded-lg p-4">
        <Label>Key Features</Label>

        <AsyncSelect
          isMulti
          loadOptions={loadFeatureOptions}
          onChange={(newValue: MultiValue<SelectOption> | SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
            if (!newValue) return;
            
            const selectedOptions = Array.isArray(newValue) ? newValue : [newValue];
            const newFeatures = selectedOptions.map((option) => ({
              featureId: option.value,
              name: option.label,
              businessNeedsId: option.businessNeedsId || '',
              associations: option.businessNeedsId ? [option.businessNeedsId] : []
            }));
            setFormData(prev => ({
              ...prev,
              key_features: newFeatures
            }));
          }}
          value={formData.key_features?.map(feature => ({
            value: feature.featureId,
            label: feature.name,
            businessNeedsId: feature.businessNeedsId
          }))}
          placeholder="Select features..."
        />

        <Button variant="outline" onClick={() => setAddingField("key_features")}>
          + Add New Key Feature
        </Button>

        {addingField === "key_features" && (
          <div className="flex flex-col gap-2 mt-2 border p-2 bg-blue-50">
            <Input 
              className="bg-white" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              placeholder="New Key Feature..." 
            />
            <Label className="text-red-500">* Select Associated Business Need (Required)</Label>
            <MultiSelect
              options={allBusinessNeeds.map(bn => ({ label: bn.name, value: bn.businessNeedsId }))}
              selectedValues={associations}
              onChange={(values) => setAssociations(values.slice(0, 1))} // Only allow one selection
              placeholder="Select Business Need..."
            />
            <Button 
              className="mt-2" 
              onClick={() => handleAdd("key_features")}
              disabled={!newName || associations.length === 0}
            >
              Save Key Feature
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {(formData.key_features || []).map((feat: any) => (
            <Badge 
              key={feat.name} 
              onClick={() => handleRemove("key_features", feat.name)} 
              variant="active" 
              className="cursor-pointer"
            >
              {feat.name}
              {feat.businessNeedsId && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({allBusinessNeeds.find(bn => bn.businessNeedsId === feat.businessNeedsId)?.name})
                </span>
              )}
              <span className="ml-2 pl-2 border-l text-red-500">✕</span> 
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
