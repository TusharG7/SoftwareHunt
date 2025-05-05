"use client"

import * as React from "react"
import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { addNewVendor, checkVendorExistsByEmail, fetchAllVendor } from "@/controllers/vendors.controller"
import AddSoftwareMultiStep from "../softwares/AddSoftwareForm"

export function AddForm({ setAllVendors, setTotalCount, page, itemsPerPage }: { setAllVendors: any; setTotalCount: any, page: number, itemsPerPage: number }) {
  const isMobile = useIsMobile()
  const [step, setStep] = useState(1)
  const [lastCreatedVendor, setLastCreatedVendor] = useState({vendorId:"",name:""});
const [showAddSoftware, setShowAddSoftware] = useState(false);
  const [loading, setLoading] = useState(false)
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    companyDescription: "",
    website: "",
    yearFounded: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendor({ ...vendor, [e.target.id]: e.target.value })
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vendor.name && vendor.email) {
      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(vendor.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
  
      try {
        // Directly call the service method to check if the vendor exists
        const response = await checkVendorExistsByEmail(vendor.email);
  
        console.log("Vendor Exists:",response); // Log the response
  
        if (response.success) {
          toast.error("Vendor already exists.");
          return;
        }
  
        // Proceed to the next step if vendor does not exist
        setStep(2);
      } catch (error) {
        console.error("Error checking vendor existence:", error);
        toast.error("Failed to check vendor existence. Please try again.");
      }
    } else {
      toast.error("Please fill in both name and email.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const randomPassword = Math.random().toString(36).slice(-10)
    const newVendor = { ...vendor, password: randomPassword }

    try {
      const {response} = await addNewVendor(newVendor)
      if (!response.success) {
        console.log("response",response);
        toast.error(response.message)
        return
      }

      toast.success(response.message)
      setVendor({ name: "", email: "", companyDescription: "", website: "", yearFounded: "" })
      setStep(1)

      const { vendors, totalcount } = await fetchAllVendor(page, itemsPerPage)
      setAllVendors(vendors)
      setTotalCount(totalcount)

      console.log("response.message.vendor",response.vendor);
      setLastCreatedVendor(response.vendor); // Make sure your backend returns the vendor object
    setShowAddSoftware(true);

    } catch (error: any) {
      console.error("Error adding vendor:", error)
      toast.error(error.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <>
    {showAddSoftware && lastCreatedVendor && (
     
      <AddSoftwareMultiStep
        setShowForm={setShowAddSoftware}
        onSuccess={() => setShowAddSoftware(false)}
        preselectedVendor={{
          id: lastCreatedVendor.vendorId,
          name: lastCreatedVendor.name,
        }}
      />
    )}
    {!showAddSoftware && (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden md:inline">Add Vendor</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Vendor</DrawerTitle>
        </DrawerHeader>
        <Separator />
        <div className="flex flex-col gap-4 p-4 text-sm">
          <form className="flex flex-col gap-4" onSubmit={step === 1 ? handleContinue : handleSubmit}>
            {step === 1 && (
              <>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="name">Vendor Name</Label>
                  <Input id="name" value={vendor.name} onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" value={vendor.email} onChange={handleChange} required />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="companyDescription">Company Description</Label>
                  <Input id="companyDescription" value={vendor.companyDescription} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={vendor.website} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="yearFounded">Founded Year</Label>
                  <select
                    id="yearFounded"
                    value={vendor.yearFounded}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <DrawerFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : step === 1 ? "Continue" : "Submit"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
    )}
    </>
  )
}

