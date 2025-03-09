import { Rental } from "../types";

export async function createRental(rental: Rental) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/rent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rentalDate: rental.RentalDate,
      pickUpTime: rental.PickUpTime,
      dropOffTime: rental.DropOffTime,
      totalPrice: rental.TotalPrice,
      paymentStatus: rental.PaymentStatus,
      carPlateNo: rental.CarPlateNo,
      nric: rental.NRIC,
    }),
  });

  const json = await response.json();

  return { response, json };
}

export async function getAllRentals() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/`);
  const json = await response.json();
  return { response, json };
}

export async function getRentalByNRICAndCarPlate(nric: string, carPlateNo: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/nric/${nric}/carPlateNo/${carPlateNo}`);
  const json = await response.json();
  return { response, json };
}

export async function getRentalsByNRIC(nric: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/nric/${nric}`);
  const json = await response.json();

  return { json };
}

export async function getRentalsByCarPlate(carPlateNo: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/carPlateNo/${carPlateNo}`);
  const json = await response.json();

  return { json };
}

export async function getRentalById(rentalId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/rentalId/${rentalId}`);
  const json = await response.json();

  return { json };
}

export async function updateRentalPaymentStatus(rentalId: number, paymentStatus: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/rental/update/${rentalId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentStatus }),
  });

  const json = await response.json();

  return { response, json };
}

export async function deleteRentalById(rentalId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/rentals/rental/delete/${rentalId}`, {
    method: "DELETE",
  });

  const json = await response.json();

  return { response, json };
}
