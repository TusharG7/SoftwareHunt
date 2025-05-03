export async function addNewVendor(data: {
  name: string;
  email: string;
  website: string;
  password: string;
  companyDescription: string;
  yearFounded: string;
}): Promise<any> {
  try {
    const response = await fetch("/api/private/vendors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}

export async function fetchAllVendor(
  page: number,
  itemsPerPage: number
): Promise<any> {
  try {
    const response = await fetch(
      `/api/private/vendors?page=${page || 1}&itemsPerPage=${
        itemsPerPage || 10
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}

export async function fetchVendorsOptions(): Promise<any> {
  try {
    const response = await fetch(
      `/api/private/vendors/options`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}

export async function updateVendor(vendorId: string, data: any): Promise<any> {
  try {
    const response = await fetch(`/api/private/vendors/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}

export async function fetchVendorById(vendorId: string): Promise<any> {
  try {
    const response = await fetch(`/api/private/vendors/${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}

export async function checkVendorExistsByEmail(email: string): Promise<any> {
  try {
    const response = await fetch(`/api/private/vendors/check/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("in controller error - ", error);
    return error;
  }
}