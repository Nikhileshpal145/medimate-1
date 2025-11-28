import { User } from "firebase/auth";

export type AppUser = User & {
    role: 'doctor' | 'patient';
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  status: 'Critical' | 'Stable' | 'Recovered';
  avatar: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientAvatar: string;
  doctor: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
};

export type BloodUnit = {
  id: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  units: number;
  collectionDate: string;
  expiryDate: string;
  status: 'Usable' | 'Quarantined' | 'Expired';
};

export type Medicine = {
  id: string;
  name: string;
  stock: number;
  reorderPoint: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};
