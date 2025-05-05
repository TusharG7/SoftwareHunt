import { NextRequest, NextResponse } from "next/server";
import { addNewVendor, getAllVendors } from "@/services/vendors.service";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    const { name, email, website, password, companyDescription, yearFounded } = body;
    if (!name || !email || !website || !password || !companyDescription || !yearFounded) {
      return NextResponse.json(
        { error: "All fields (name, email, website, password, companyDescription, yearFounded) are required." },
        { status: 400 }
      );
    }

    // Call the addNewVendor service method
    const response = await addNewVendor({ name, email, website, password, companyDescription, yearFounded });
    // Return success response
    return NextResponse.json({response});
  } catch (error) {
    console.error("Error in POST /vendors:", error);
    return NextResponse.json(
      { error: "Failed to add new vendor. " + error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    const page = parseInt(req.nextUrl?.searchParams.get('page') || '1');
    const itemsPerPage = parseInt(req.nextUrl?.searchParams.get('itemsPerPage') || '50');

    const res = await getAllVendors({page,itemsPerPage})


    return NextResponse.json(res);
}