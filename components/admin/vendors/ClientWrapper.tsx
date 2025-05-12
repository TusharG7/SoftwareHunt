"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddForm } from "./AddVendorForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  fetchAllVendor,
  fetchVendorById,
  updateVendor,
} from "@/controllers/vendors.controller";
import { Switch } from "@/components/ui/switch";

type Vendor = {
  vendor_id: string;
  name: string;
  email: string;
  website: string;
  yearFounded: string;
  companyDescription: string;
  status: string;
  updatedAt: Date | null;
  softwareCount: number;
};

const ClientWrapper = ({
  vendors,
  itemsPerPage,
  totalcount,
  page,
}: {
  vendors: Vendor[];
  itemsPerPage: number;
  totalcount: number;
  page: number;
}) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [allVendors, setAllVendors] = useState(vendors);
  const [totalCount, setTotalCount] = useState(totalcount);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);

  const isMobile = useIsMobile();

  // Calculate total pages
  const totalPages = Math.ceil(totalcount / itemsPerPage);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Format the date to a relative time (e.g., "2 days ago")
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    try {
      return date.toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handle page change
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    // Fetch new vendors for the selected page
    const { vendors } = await fetchAllVendor(newPage, itemsPerPage);
    setAllVendors(vendors);
  };

  // Handle row click to open the drawer with prefilled data
  const handleRowClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  // Handle form submission to update vendor details
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    // Validate required fields
    if (!selectedVendor.name.trim()) {
      toast.error("Vendor name is required");
      return;
    }

    if (!selectedVendor.email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(selectedVendor.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate website if provided
    if (selectedVendor.website) {
      // Add https:// if not present
      let websiteUrl = selectedVendor.website;
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = `https://${websiteUrl}`;
      }

      // Check if URL has a valid domain suffix
      try {
        const url = new URL(websiteUrl);
        const hasValidSuffix = url.hostname.includes('.');
        if (!hasValidSuffix) {
          toast.error("Please enter a valid website URL with a domain suffix (e.g., .com, .org, .in)");
          return;
        }
        // Update the website with the proper format
        selectedVendor.website = websiteUrl;
      } catch (error) {
        toast.error("Please enter a valid website URL");
        return;
      }
    }

    // Validate company description
    if (!selectedVendor.companyDescription.trim()) {
      toast.error("Company description is required");
      return;
    }

    // Validate year founded
    if (!selectedVendor.yearFounded) {
      toast.error("Founded year is required");
      return;
    }

    setLoading(true);
    try {
      const response = await updateVendor(
        selectedVendor.vendor_id,
        selectedVendor
      );
      if (response.message) {
        toast.success("Vendor updated successfully!");

        const updatedVendor = await fetchVendorById(selectedVendor.vendor_id);
        setAllVendors((prev) =>
          prev.map((vendor) =>
            vendor.vendor_id === updatedVendor.vendor_id
              ? { 
                  ...updatedVendor,
                  softwareCount: vendor.softwareCount, // Preserve software count
                  updatedAt: new Date() // Update the timestamp
                }
              : vendor
          )
        );

        // Close the drawer
        setSelectedVendor(null);
      } else {
        toast.error(response.message || "Failed to update vendor.");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (vendorId: string, newStatus: string) => {
    try {
      const response = await updateVendor(vendorId, { status: newStatus });
      if (response.message) {
        toast.success("Vendor status updated successfully!");

        // Update the vendor's status in the table
        setAllVendors((prev) =>
          prev.map((vendor) =>
            vendor.vendor_id === vendorId
              ? { 
                  ...vendor, 
                  status: newStatus,
                  updatedAt: new Date() // Update the timestamp
                }
              : vendor
          )
        );
      } else {
        toast.error("Failed to update vendor status.");
      }
    } catch (error) {
      console.error("Error updating vendor status:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <AddForm
          setAllVendors={setAllVendors}
          setTotalCount={setTotalCount}
          page={page}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Vendor Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Softwares Registered</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allVendors?.map((vendor) => (
              <TableRow key={vendor.vendor_id}>
                <TableCell>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleRowClick(vendor)}
                  >
                    {vendor.name}
                  </button>
                </TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {vendor.website}
                  </a>
                </TableCell>
                <TableCell>
                  {vendor.softwareCount || 0}
                </TableCell>
                <TableCell>
                  {formatDate(vendor.updatedAt)}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={vendor.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      handleStatusToggle(
                        vendor.vendor_id,
                        checked ? "ACTIVE" : "INACTIVE"
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      )}

      {/* Edit Vendor Drawer */}
      {selectedVendor && (
        <Drawer
          open={selectedVendor ? true : false}
          direction={isMobile ? "bottom" : "right"}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Vendor</DrawerTitle>
            </DrawerHeader>
            <Separator />
            <div className="flex flex-col gap-4 p-4 text-sm">
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={selectedVendor.name}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={selectedVendor.email}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={selectedVendor.website}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="yearFounded">Founded Year</Label>
                  <select
                    id="yearFounded"
                    value={selectedVendor.yearFounded}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        yearFounded: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="companyDescription">
                    Company Description
                  </Label>
                  <Input
                    id="companyDescription"
                    value={selectedVendor.companyDescription}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        companyDescription: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display software count (read-only) */}
                {selectedVendor.softwareCount !== undefined && (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="softwareCount">Softwares Registered</Label>
                    <Input
                      id="softwareCount"
                      value={selectedVendor.softwareCount}
                      disabled
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={selectedVendor.status}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        status: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <DrawerFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVendor(null)}
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default ClientWrapper;
