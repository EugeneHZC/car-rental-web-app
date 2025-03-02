import { useEffect, useState } from "react";
import CarDisplayCard from "../../components/CarDisplayCard";
import { Branch, Car, Rental } from "../../types";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { getAllCars } from "../../api/car";
import { getAllBranches } from "../../api/branch";
import { getAllRentals } from "../../api/rental";
import SearchBar from "../../components/SearchBar";

const Home = () => {
  const [searchDesc, setSearchDesc] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pickUpDateFilter, setPickUpDateFilter] = useState("");
  const [dropOffDateFilter, setDropOffDateFilter] = useState("");
  const [rentals, setRentals] = useState<Rental[]>([]);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const { json: carData } = await getAllCars();
      if (carData.length > 0) {
        setCars(carData);
      } else {
        setCars([]);
      }

      const { json: branchData } = await getAllBranches();
      if (branchData.length > 0) {
        setBranches(branchData);
      }

      const { json: rentalData } = await getAllRentals();
      if (rentalData.length > 0) {
        setRentals(rentalData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!user) navigate("/login");

    fetchData();
  }, [user]);

  return (
    <div className="home-container">
      <SearchBar searchDesc={searchDesc} setSearchDesc={setSearchDesc} />

      <div className="date-filter">
        <h3>Date Filter</h3>
        <div className="date-filter-inputs">
          <div className="input-section date-filter-input">
            <label htmlFor="pick-up-date">Pick Up Date</label>
            <input
              type="date"
              name="pick-up-date"
              value={pickUpDateFilter}
              placeholder="Pick Up Date"
              onChange={(e) => setPickUpDateFilter(e.target.value)}
            />
          </div>
          <div className="input-section date-filter-input">
            <label htmlFor="drop-off-date">Drop Off Date</label>
            <input
              type="date"
              name="drop-off-date"
              value={dropOffDateFilter}
              placeholder="Drop Off Date"
              onChange={(e) => setDropOffDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="cards">
        {cars.length > 0 &&
          cars
            .filter((car) => {
              const statusFilter = car.Status === "Good" && user?.role === "Customer";

              const modelFilter = car.Model.toLowerCase().includes(searchDesc.toLowerCase());
              const colourFilter = car.Colour.toLowerCase().includes(searchDesc.toLowerCase());
              const priceFilter = car.PricePerDay.toString().toLowerCase().includes(searchDesc);
              const branchFilter = branches
                .find((branch) => car.BranchNo === branch.BranchNo)
                ?.Address.toLowerCase()
                .includes(searchDesc.toLowerCase());

              // date filter
              const pickUpDateTime = new Date(`${pickUpDateFilter} 00:00`).getTime();
              const dropOffDateTime = new Date(`${dropOffDateFilter} 23:59`).getTime();

              // get the current car rentals
              const carRentals = rentals.filter((rental) => rental.CarPlateNo === car.CarPlateNo);
              // filter out to see whether each rental pick up date and drop off date overlaps with the filter input by user
              // if one of the dates overlapped, dateFilter will be false
              const dateFilter = carRentals.every((rental) => {
                const currentPickUpDateTime = new Date(rental?.PickUpTime ?? "").getTime();
                const currentDropOffDateTime = new Date(rental?.DropOffTime ?? "").getTime();
                return currentPickUpDateTime > dropOffDateTime || currentDropOffDateTime < pickUpDateTime;
              });

              if (pickUpDateFilter !== "" && dropOffDateFilter !== "" && carRentals.length)
                return (
                  (modelFilter || colourFilter || priceFilter || branchFilter) &&
                  dateFilter &&
                  (statusFilter || user?.role === "Staff")
                );

              return (
                (modelFilter || colourFilter || priceFilter || branchFilter) && (statusFilter || user?.role === "Staff")
              );
            })
            .map((car) => (
              <CarDisplayCard key={car.CarPlateNo} car={car} fetchCarCallback={fetchData} branches={branches} />
            ))}
      </div>
    </div>
  );
};

export default Home;
