import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Rent from "./pages/rent/Rent";
import CustomerRegistration from "./pages/CustomerRegistration";
import Payment from "./pages/Payment";
import AddCar from "./pages/AddCar";
import RentalHistory from "./pages/RentalHistory";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/register-customer" element={<CustomerRegistration />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/add-car" element={<AddCar />} />
            <Route path="/rental-history" element={<RentalHistory />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
