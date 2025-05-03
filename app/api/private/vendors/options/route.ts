import { getVendorsOptions } from "@/services/vendors.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    
    const res = await getVendorsOptions()


    return NextResponse.json(res);
}