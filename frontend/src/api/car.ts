import { Car } from "../types";

export async function getAllCars() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/`);
  const json = await response.json();

  return { response, json };
}

export async function getCarByCarPlate(carPlateNo: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/${carPlateNo}`);
  const json = await response.json();

  return { response, json };
}

export async function addCar(car: Car) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });

  const json = await response.json();

  return { response, json };
}

export async function uploadCarImage(carPlateNo: string, formData: FormData) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/upload/${carPlateNo}`, {
    method: "PATCH",
    body: formData,
  });

  const json = await response.json();

  return { response, json };
}

export async function removeCar(carPlateNo: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/remove/${carPlateNo}`, { method: "DELETE" });

  const json = await response.json();

  return { response, json };
}

export async function updateCar(car: Car) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });

  const json = await response.json();

  return { response, json };
}
