import { Staff } from "../types";

export async function createStaff(staff: Staff) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/staff/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });

  const json = await response.json();

  return { response, json };
}

export async function getStaffByUserId(userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/staff/${userId}`);
  const json = await response.json();

  return { response, json };
}

export async function updateStaffInfo(staff: Staff) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/staff/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });
  const json = await response.json();

  return { response, json };
}

export async function deleteStaff(userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/staff/delete/${userId}`, {
    method: "DELETE",
  });
  const json = await response.json();

  return { response, json };
}
