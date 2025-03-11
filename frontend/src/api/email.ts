export async function sendEmail(data: any) {
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
