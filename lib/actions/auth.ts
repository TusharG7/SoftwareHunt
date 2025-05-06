'use server'

import { signIn } from "@/auth"
import { db } from "@/database/drizzle";
import { adminTable, vendorTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const signInWithCredentials = async (params: Pick<AuthCredentials,"email" | "password">) => {
    const { email, password } = params;

    // 1. Check if admin
    const adminUser = await db
        .select()
        .from(adminTable)
        .where(eq(adminTable.email, email))
        .limit(1);

    if (adminUser.length > 0) {
        // Validate password
        const isPasswordValid = await compare(password, adminUser[0].password);
        if (!isPasswordValid) {
            return { success: false, error: "Invalid Password" };
        }
        // Optionally check status if admins have it
        // Call signIn
        return await signIn('credentials', { email, password, redirect: false });
    }

    // 2. Check if vendor
    const vendorUser = await db
        .select()
        .from(vendorTable)
        .where(eq(vendorTable.email, email))
        .limit(1);

    if (vendorUser.length === 0) {
        return { success: false, error: "Account does not exist" };
    }

    if (vendorUser[0].status !== "ACTIVE") {
        return { success: false, error: "Account is not active" };
    }

    const isPasswordValid = await compare(password, vendorUser[0].password);
    if (!isPasswordValid) {
        return { success: false, error: "Invalid Password" };
    }

    // All checks passed, call signIn
    return await signIn('credentials', { email, password, redirect: false });
};