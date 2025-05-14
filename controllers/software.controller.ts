export async function checkSoftwareExistsByName(name: string): Promise<any> {
  try {
    const response = await fetch(`/api/private/software/${encodeURIComponent(name)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result; // { exists: true/false }
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}

export async function addNewSoftware(formData: any): Promise<any> {
  try {
    const response = await fetch("/api/private/software", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      return result; // { success: true, software: ... }
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}

// Add to controllers/software.controller.ts
export async function updateSoftwareStatus(
  softwareId: string,
  status: string
): Promise<any> {
  try {
    const response = await fetch(`/api/private/software/update/${softwareId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, ...result };
    } else {
      const errorData = await response.json();
      return { success: false, ...errorData };
    }
  } catch (error) {
    console.error("Error updating software status:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
