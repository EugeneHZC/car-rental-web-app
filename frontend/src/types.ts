export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Car = {
  CarPlateNo: string;
  Model: string;
  Colour: string;
  Status: string;
  PricePerDay: number;
  BranchNo: string;
};

export type Branch = {
  BranchNo: string;
  PhoneNumber: string;
  Address: string;
};

export type Customer = {
  NRIC: string;
  Name: string;
  Gender: string;
  PhoneNumber: string;
  LicenseNumber: number;
  Address: string;
  UserID: number | null;
};

export type Rental = {
  RentalID: number;
  RentalDate: string;
  PickUpTime: string;
  DropOffTime: string;
  TotalPrice: number;
  PaymentStatus: "Paid" | "Not Paid";
  CarPlateNo: string;
  NRIC: string;
};

export type Staff = {
  StaffID: string;
  Name: string;
  Gender: string;
  PhoneNumber: string;
  UserID: number;
  BranchNo: string;
};
