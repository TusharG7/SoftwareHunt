import { NextRequest, NextResponse } from "next/server";
import { getBusinessNeedsOptions } from "@/services/businessNeeds.service";

export async function GET(request: NextRequest) {
  try {
    const options = await getBusinessNeedsOptions();
    return NextResponse.json({ businessNeeds: options }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch business needs." }, { status: 500 });
  }
}
