import { Customer } from "../types";

export async function createCustomer(
  name: string,
  gender: string,
  nric: string,
  phoneNumber: string,
  licenseNumber: number,
  address: string,
  userId: number
) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/customers/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, gender, nric, phoneNumber, licenseNumber, address, userId }),
  });

  const json = await response.json();

  return { response, json };
}

export async function getCustomerByUserId(userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/customers/customer/${userId}`);
  const json = await response.json();

  return { response, json };
}

export async function updateCustomerInfo(customer: Customer) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/customers/customer/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });
  const json = await response.json();

  return { response, json };
}

export async function getCustomerByNRIC(nric: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/customers/customer/nric/${nric}`);
  const json = await response.json();

  return { response, json };
}

export async function deleteCustomer(userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/customers/customer/delete/${userId}`, {
    method: "DELETE",
  });
  const json = await response.json();

  return { response, json };
}
