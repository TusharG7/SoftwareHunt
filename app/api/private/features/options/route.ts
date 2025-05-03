import { NextRequest, NextResponse } from "next/server";
import { getFeaturesOptions } from "@/services/features.service";

export async function GET(request: NextRequest) {
  try {
    const options = await getFeaturesOptions();
    return NextResponse.json({ features: options }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch features." }, { status: 500 });
  }
}
