// components/admin/softwares/ClientWrapper.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddSoftwareMultiStep from "./AddSoftwareForm";
import { getAllSoftware } from "@/services/software.service";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Software {
  softwareId: string;
  softwareName: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  status: string | null;
  isFree: boolean | null;
  industries: { id: string; name: string; }[] | null;
  businessNeeds: { id: string; name: string; }[] | null;
  updatedAt: Date | null;
  views?: number;
  leads?: number;
}

interface ClientWrapperProps {
  initialSoftwares: Software[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

const ClientWrapper = ({
  initialSoftwares,
  totalCount: initialTotalCount,
  currentPage: initialPage,
  itemsPerPage,
}: ClientWrapperProps) => {
  const [softwares, setSoftwares] = useState<Software[]>(initialSoftwares);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [sortBy, setSortBy] = useState<"softwareName" | "status" | "updatedAt">(
    "updatedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchSoftwares = async (page: number) => {
    try {
      setLoading(true);
      const { softwares: newSoftwares, totalCount: newTotalCount } =
        await getAllSoftware({
          page,
          itemsPerPage,
          sortBy,
          sortOrder,
        });
      setSoftwares(newSoftwares);
      setTotalCount(newTotalCount);
      setCurrentPage(page);
    } catch (error) {
      toast.error("Failed to fetch software");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: "softwareName" | "status" | "updatedAt") => {
    const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newOrder);
    fetchSoftwares(1); // Reset to first page when sorting
  };

  const handlePageChange = (page: number) => {
    fetchSoftwares(page);
  };

  const handleSoftwareAdded = () => {
    setShowForm(false);
    fetchSoftwares(1); // Refresh the list
    toast.success("Software added successfully!");
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Softwares</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchSoftwares(currentPage)}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close Form" : "Add New Software"}
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6">
          <AddSoftwareMultiStep
            setShowForm={setShowForm}
            onSuccess={handleSoftwareAdded}
            preselectedVendor={null}
          />
        </div>
      )}

      {/* Software Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Software</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead>Industries</TableHead>
              <TableHead>Business Needs</TableHead>
              {/* <TableHead>Pricing</TableHead> */}
              <TableHead>Views</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("updatedAt")}
              >
                Updated{" "}
                {sortBy === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : softwares.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No software found
                </TableCell>
              </TableRow>
            ) : (
              softwares.map((software) => {
                const randomViews = software.views || Math.floor(Math.random() * 10000) + 100;
                const randomLeads = software.leads || Math.floor(Math.random() * 100) + 5;
                
                return (
                  <TableRow key={software.softwareId}>
                    <TableCell>
                      <div className="flex items-center gap-5 w-max pr-2">
                        {software.logo ? (
                          <Image
                            src={software.logo}
                            alt={software.softwareName}
                            className="w-10 h-10 rounded object-contain"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No logo</span>
                          </div >
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {software.softwareName}
                          </span>
                          {software.website && (
                            <a
                              href={software.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm hover:underline"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div
                        className="max-w-xs truncate"
                        title={software?.description || ""}
                      >
                        {software.description}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1 w-min pr-2">
                        {software?.industries?.map((industry) => (
                          <Badge key={industry.id} variant="secondary">
                            {industry.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 w-min pr-2">
                        {software?.businessNeeds?.map((need) => (
                          <Badge key={need.id} variant="outline">
                            {need.name}
                          </Badge>
                        )) || "None"}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant={software?.isFree ? "secondary" : "default"}>
                        {software.isFree ? "Free" : "Paid"}
                      </Badge>
                    </TableCell> */}
                    <TableCell>
                      <span className="text-sm font-medium">{randomViews.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{randomLeads.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          software.status === "ACTIVE" ? "default" : "destructive"
                        }
                      >
                        {software.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {software?.updatedAt
                        ? new Date(software.updatedAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  // disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  // disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ClientWrapper;
