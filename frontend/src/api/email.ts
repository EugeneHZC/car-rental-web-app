export async function sendEmail(
  customerName: string,
  customerEmail: string,
  staffName: string,
  staffEmail: string,
  rentalDate: string
) {
  // send email to customer notifying that rent has been cancelled by staff
  const data = {
    service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    template_params: {
      customer_email: customerEmail,
      staff_name: staffName,
      staff_email: staffEmail,
      customer_name: customerName,
      rental_date: rentalDate,
    },
  };

  try {
    // sending email using emailjs
    await fetch(import.meta.env.VITE_EMAILJS_SEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
}
