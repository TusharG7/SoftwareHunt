import { NextRequest, NextResponse } from "next/server";
import { getVendorDetails, updateVendorDetails } from "@/services/vendors.service";

export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Extract vendorId from the URL
    const url = new URL(request.url);
    const vendorId = url.pathname.split("/").at(-1); // Extract vendorId from the path

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required." },
        { status: 400 }
      );
    }

    // Validate required fields
    const { status, name, email, website, yearFounded, companyDescription } = body;

    // Call the updateVendorDetails service method
    const result = await updateVendorDetails(vendorId, { status, name, email, website, yearFounded, companyDescription });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /vendors/[vendorId]:", error);
    return NextResponse.json(
      { error: "Failed to update vendor status. " + error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract vendorId from the URL
    const url = new URL(request.url);
    const vendorId = url.pathname.split("/").at(-1); // Extract vendorId from the path

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required." },
        { status: 400 }
      );
    }

    // Call the getVendorDetails service method
    const vendor = await getVendorDetails(vendorId);

    // Return the vendor details
    return NextResponse.json(vendor, { status: 200 });
  } catch (error) {
    console.error("Error in GET /vendors/[vendorId]:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor details. " + error },
      { status: 500 }
    );
  }
}