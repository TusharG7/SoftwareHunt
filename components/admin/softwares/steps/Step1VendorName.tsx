"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { z } from "zod"
import { fetchVendorsOptions } from "@/controllers/vendors.controller"
import { checkSoftwareExistsByName } from "@/controllers/software.controller"
import { Vendor, FormData } from '@/types/software'

// Define Zod schema for validation
const step1Schema = z.object({
  vendor_id: z.string().nonempty("Please select a vendor."),
  software_name: z.string().nonempty("Please enter a software name."),
})

interface Props {
  formData: FormData
  setFormData: (val: FormData | ((prev: FormData) => FormData)) => void
  onNext: () => void
  onCancel: () => void
  preselectedVendor?: { id: string; name: string }
}

export default function Step1VendorName({
  formData,
  setFormData,
  onNext,
  onCancel,
  preselectedVendor,
}: Props) {
  const [vendors, setVendors] = useState<Vendor[]>([]) // State to store fetched vendors
  const [errors, setErrors] = useState<{ vendor_id?: string; software_name?: string }>({})
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(formData.vendor)

  const handleVendorSelect = (vendorId: string) => {
    const vendor = vendors.find(v => v.vendor_id === vendorId);
    if (vendor) {
      setSelectedVendor(vendor);
      setFormData(prev => ({
        ...prev,
        vendor,
        vendor_id: vendorId
      }));
    }
  };

  const handleNext = async () => {
    // Validate form data with Zod
    const result = step1Schema.safeParse({
      vendor_id: formData.vendor_id || "",
      software_name: formData.software_name || "",
    })

    if (!result.success) {
      // Map Zod errors to state
      const fieldErrors: { vendor_id?: string; software_name?: string } = {}
      result.error.errors.forEach((err) => {
        if (err.path[0] === "vendor_id") fieldErrors.vendor_id = err.message
        if (err.path[0] === "software_name") fieldErrors.software_name = err.message
      })
      setErrors(fieldErrors)
      return
    }

    // Call the API to check for duplicate software name
    const checkRes = await checkSoftwareExistsByName(formData.software_name.trim())
    console.log("Software exists response:", checkRes)

    if (checkRes.exists) {
      setErrors((prev) => ({ ...prev, software_name: "Software name already exists." }))
      return
    } else {
      // Clear errors and proceed to the next step
      setErrors({})
      onNext()
    }
  }

  async function fetchVendors() {
    try {
      const response = await fetchVendorsOptions()
      if (response.vendors) {
        setVendors(response.vendors) // Set fetched vendors to state
      }
    } catch (error) {
      console.error("Error fetching vendors:", error)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  // Add this useEffect to handle preselectedVendor
  useEffect(() => {
    if (preselectedVendor && vendors.length > 0) {
      const vendor = vendors.find(v => v.vendor_id === preselectedVendor.id);
      if (vendor) {
        setSelectedVendor(vendor);
        setFormData(prev => ({
          ...prev,
          vendor,
          vendor_id: vendor.vendor_id
        }));
      }
    }
  }, [preselectedVendor, vendors]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Step 1: Vendor & Software Name</h2>

      <div className="flex flex-col gap-3">
        <Label>Vendor</Label>
        <Select onValueChange={handleVendorSelect} value={selectedVendor?.vendor_id}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vendor_id && <p className="text-red-500 text-sm">{errors.vendor_id}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="software_name">Software Name</Label>
        <Input
          id="software_name"
          value={formData.software_name}
          onChange={(e) => {
            setFormData((prev: FormData) => ({ ...prev, software_name: e.target.value }))
            setErrors((prev) => ({ ...prev, software_name: undefined })) // Clear error
          }}
        />
        {errors.software_name && <p className="text-red-500 text-sm">{errors.software_name}</p>}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}