export async function createPayment(
  paymentDate: string | null,
  paymentMethod: string,
  amountPaid: number,
  rentalId: number
) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentDate,
      paymentMethod,
      amountPaid,
      rentalId: rentalId,
    }),
  });

  const json = await response.json();

  return { response, json };
}

export async function getPaymentByRentalId(rentalId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/payment/${rentalId}`);
  const json = await response.json();

  return { json };
}

export async function updatePayment(paymentId: number, paymentDate: string, paymentMethod: string, amountPaid: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/payment/update/${paymentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentDate, paymentMethod, amountPaid }),
  });
  const json = await response.json();

  return { response, json };
}
