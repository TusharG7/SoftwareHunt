import { checkVendorExistsByEmail } from "@/services/vendors.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract vendorId from the URL
    const url = new URL(request.url);
    const email = url.pathname.split("/").at(-1); // Extract vendorId from the path

    if (!email) {
      return NextResponse.json(
        { error: "Vendor ID is required." },
        { status: 400 }
      );
    }

    // Call the getVendorDetails service method
    const response = await checkVendorExistsByEmail(email);

    // Return the vendor details
    return NextResponse.json({success:response}, { status: 200 });
  } catch (error) {
    console.error("Error in GET /vendors/check/[email]:", error);
    return NextResponse.json(
      { error: "Failed to check if vendor exist. " + error },
      { status: 500 }
    );
  }
}