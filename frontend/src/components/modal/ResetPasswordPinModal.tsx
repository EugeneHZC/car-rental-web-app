import { useRef, useState } from "react";
import "./modal.css";
import { sendEmail } from "../../api/email";

const ResetPasswordPinModal = ({
  setOpenedModal,
  email,
  setEmail,
}: {
  setOpenedModal: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [sixDigitPin, setSixDigitPin] = useState<string>("");
  const [pinValidTime, setPinValidTime] = useState(60);

  const randomResetPin = useRef(Math.floor(Math.random() * Math.pow(10, 6)));
  const intervalRef = useRef<NodeJS.Timeout>(null);

  function handleVerifyClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (parseInt(sixDigitPin) !== randomResetPin.current) return alert("Pin incorrect!");
    setOpenedModal("reset-password");
  }

  function handleCloseClicked() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setOpenedModal("");
  }

  function startTimer() {
    setPinValidTime(60);

    intervalRef.current = setInterval(() => {
      // get the latest state
      setPinValidTime((prevSecond) => {
        if (prevSecond <= 0 && intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prevSecond - 1;
      });
    }, 1000);
  }

  function sendResetPinEmail(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (email === "") return alert("Please enter your email.");

    startTimer();

    // send email to customer notifying that rent has been cancelled by staff
    const data = {
      service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      template_id: import.meta.env.VITE_EMAILJS_RESET_PIN_TEMPLATE_ID,
      user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      template_params: {
        customer_email: email,
        reset_pin: randomResetPin.current,
      },
    };

    sendEmail(data);
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <form className="modal-form">
          <div className="form-container">
            <h2>Reset PIN</h2>
            <p>Click on the 'Send PIN' button to send a 6-digit pin to your email.</p>

            <div className="input-section">
              <label htmlFor="email">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-section">
              <label htmlFor="pin">6-digit PIN</label>
              <div className="recover-pin-input">
                <input
                  type="number"
                  required
                  value={sixDigitPin}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value < 0) return;
                    setSixDigitPin(e.target.value);
                  }}
                />
                <button
                  className={intervalRef.current === null ? "btn-normal" : "btn-disabled"}
                  disabled={intervalRef.current !== null}
                  type="button"
                  onClick={sendResetPinEmail}
                >
                  {intervalRef.current === null ? "Send PIN" : `Send again in...${pinValidTime}s`}
                </button>
              </div>
            </div>

            <div className="buttons">
              <button className="btn-normal" type="button" onClick={handleVerifyClicked}>
                Verify
              </button>
              <button className="btn-gray" type="button" onClick={handleCloseClicked}>
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPinModal;
