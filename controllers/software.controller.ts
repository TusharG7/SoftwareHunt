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
