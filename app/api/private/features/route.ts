import { NextRequest, NextResponse } from "next/server";
import { searchFeatures } from "@/services/features.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await searchFeatures(searchTerm, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /features:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}