import { db } from "@/database/drizzle";
import { vendorTable } from "@/database/schema";
import bcrypt from "bcryptjs";
import { eq, count } from "drizzle-orm";
import { year } from "drizzle-orm/mysql-core";

// Define a type for the vendor data
interface VendorData {
  name: string;
  email: string;
  website: string;
  password: string;
}

export async function checkVendorExistsByEmail(email: string): Promise<boolean> {
  try {
    const existingVendor = await db
      .select()
      .from(vendorTable)
      .where(eq(vendorTable.email, email))
      .limit(1);

    return existingVendor.length > 0; // Returns true if vendor exists, false otherwise
  } catch (error) {
    console.error("Error checking if vendor exists:", error);
    throw new Error("Failed to check vendor existence.");
  }
}

export async function addNewVendor(data: VendorData & { companyDescription: string; yearFounded: string }): Promise<{ success: boolean; message: string, vendor: any }> {
  const { name, email, website, password, companyDescription, yearFounded } = data;

  try {
    // Check if a vendor with the same email already exists
    const existingVendor = await db
      .select()
      .from(vendorTable)
      .where(eq(vendorTable.email, email))
      .limit(1);

    if (existingVendor.length > 0) {
      return { success: false, message: "Vendor with this email already exists.", vendor: null };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new vendor into the vendorTable
    const vendor = await db.insert(vendorTable).values({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      website,
      companyDescription,
      foundedYear: yearFounded, // Save the year founded
      role: "VENDOR", // Default role for vendors
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Return a generic success message
    return { success: true, message: "Vendor added successfully.", vendor: vendor[0] };
  } catch (error) {
    console.error("Error adding new vendor:", error);
    throw new Error("" + error);
  }
}


export async function getAllVendors({
  page = 1,
  itemsPerPage = 10,
}: {
  page?: number;
  itemsPerPage?: number;
}): Promise<{
  vendors: { vendor_id: string; name: string; email: string; website: string; yearFounded:string; companyDescription:string; status: string }[];
  totalcount: number;
  page: number;
}> {
  try {
    const offset = (page - 1) * itemsPerPage;

    // Query to fetch vendors with pagination
    const vendorsQuery = db
      .select({
        vendor_id: vendorTable.vendorId,
        name: vendorTable.name,
        email: vendorTable.email,
        website: vendorTable.website,
        yearFounded: vendorTable.foundedYear,
        companyDescription: vendorTable.companyDescription,
        status: vendorTable.status,
      })
      .from(vendorTable)
      .limit(itemsPerPage)
      .offset(offset)
      .orderBy(vendorTable.email);

    // Query to count the total number of vendors
    const countQuery = db
      .select({ count: count() })
      .from(vendorTable);

    // Execute both queries
    const [vendors, countResult] = await Promise.all([vendorsQuery, countQuery]);

    // Extract the total count from the count query result
    const totalcount = countResult[0]?.count || 0;

    // Return the result
    return {
      vendors,
      totalcount,
      page,
    };
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw new Error("Failed to fetch vendors.");
  }
}

export async function getVendorsOptions(): Promise<{
  vendors: { vendor_id: string; name: string }[];
}> {
  try {
    const vendors = await db
      .select({
        vendor_id: vendorTable.vendorId,
        name: vendorTable.name,
      })
      .from(vendorTable)
      .where(eq(vendorTable.status, "ACTIVE"))
      .orderBy(vendorTable.name)

    return { vendors }
  } catch (error) {
    console.error("Error fetching vendors:", error)
    throw new Error("Failed to fetch vendors.")
  }
}

export async function updateVendorDetails(
  vendorId: string,
  updates: {
    name?: string;
    email?: string;
    website?: string;
    status?: string;
    yearFounded?: string;
    companyDescription?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if the vendor exists
    const existingVendor = await db
      .select()
      .from(vendorTable)
      .where(eq(vendorTable.vendorId, vendorId))
      .limit(1);

    if (existingVendor.length === 0) {
      return { success: false, message: "Vendor not found." };
    }

    // Prepare the update object using plain string keys
    const updateData: Record<string, string | undefined> = {};
    if (updates.name) updateData["name"] = updates.name;
    if (updates.email) updateData["email"] = updates.email;
    if (updates.website) updateData["website"] = updates.website;
    if (updates.yearFounded) updateData["foundedYear"] = updates.yearFounded;
    if (updates.companyDescription) updateData["companyDescription"] = updates.companyDescription;
    if (updates.status) updateData["status"] = updates.status;

    // Update the vendor in the database
    await db
      .update(vendorTable)
      .set(updateData)
      .where(eq(vendorTable.vendorId, vendorId));

    return { success: true, message: "Vendor details updated successfully." };
  } catch (error) {
    console.error("Error updating vendor details:", error);
    return { success: false, message: "Failed to update vendor details." };
  }
}

export async function getVendorDetails(vendorId: string): Promise<{
  vendor_id: string;
  name: string;
  email: string;
  website: string;
  yearFounded: string;
  companyDescription: string;
  status: string;
}> {
  try {
    // Fetch the vendor details
    const vendor = await db
      .select({
        vendor_id: vendorTable.vendorId,
        name: vendorTable.name,
        email: vendorTable.email,
        website: vendorTable.website,
        yearFounded: vendorTable.foundedYear,
        companyDescription: vendorTable.companyDescription,
        status: vendorTable.status,
      })
      .from(vendorTable)
      .where(eq(vendorTable.vendorId, vendorId))
      .limit(1);

    if (vendor.length === 0) {
      throw new Error("Vendor not found.");
    }

    return vendor[0];
  } catch (error) {
    console.error("Error fetching vendor details:", error);
    throw new Error("Failed to fetch vendor details.");
  }
}