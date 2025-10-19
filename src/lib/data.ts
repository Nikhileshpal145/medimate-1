import type { Patient, Appointment, BloodUnit, Medicine } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const patients: Patient[] = [
  { id: 'PAT001', name: 'Aarav Sharma', age: 45, gender: 'Male', lastVisit: '2024-05-10', status: 'Stable', avatar: PlaceHolderImages.find(img => img.id === 'avatar-3')?.imageUrl || '' },
  { id: 'PAT002', name: 'Diya Patel', age: 32, gender: 'Female', lastVisit: '2024-05-12', status: 'Recovered', avatar: PlaceHolderImages.find(img => img.id === 'avatar-4')?.imageUrl || '' },
  { id: 'PAT003', name: 'Vihaan Singh', age: 67, gender: 'Male', lastVisit: '2024-05-08', status: 'Critical', avatar: PlaceHolderImages.find(img => img.id === 'avatar-5')?.imageUrl || '' },
  { id: 'PAT004', name: 'Ananya Reddy', age: 28, gender: 'Female', lastVisit: '2024-05-15', status: 'Stable', avatar: PlaceHolderImages.find(img => img.id === 'avatar-6')?.imageUrl || '' },
  { id: 'PAT005', name: 'Rohan Gupta', age: 53, gender: 'Male', lastVisit: '2024-04-20', status: 'Stable', avatar: 'https://picsum.photos/seed/patient5/100/100' },
];

export const appointments: Appointment[] = [
    { id: 'APT001', patientName: 'Aarav Sharma', patientAvatar: PlaceHolderImages.find(img => img.id === 'avatar-3')?.imageUrl || '', doctor: 'Dr. Mehta', time: '10:00 AM', status: 'Scheduled' },
    { id: 'APT002', patientName: 'Diya Patel', patientAvatar: PlaceHolderImages.find(img => img.id === 'avatar-4')?.imageUrl || '', doctor: 'Dr. Joshi', time: '10:30 AM', status: 'Scheduled' },
    { id: 'APT003', patientName: 'Vihaan Singh', patientAvatar: PlaceHolderImages.find(img => img.id === 'avatar-5')?.imageUrl || '', doctor: 'Dr. Mehta', time: '11:00 AM', status: 'Scheduled' },
    { id: 'APT004', patientName: 'Ananya Reddy', patientAvatar: PlaceHolderImages.find(img => img.id === 'avatar-6')?.imageUrl || '', doctor: 'Dr. Desai', time: '11:30 AM', status: 'Completed' },
    { id: 'APT005', patientName: 'Ishan Kumar', patientAvatar: 'https://picsum.photos/seed/patient6/100/100', doctor: 'Dr. Joshi', time: '12:00 PM', status: 'Cancelled' },
];

export const bloodStock: BloodUnit[] = [
  { id: 'BLD001', bloodGroup: 'A+', units: 25, collectionDate: '2024-05-01', expiryDate: '2024-06-10', status: 'Usable' },
  { id: 'BLD002', bloodGroup: 'O-', units: 8, collectionDate: '2024-04-28', expiryDate: '2024-06-07', status: 'Usable' },
  { id: 'BLD003', bloodGroup: 'B+', units: 15, collectionDate: '2024-05-05', expiryDate: '2024-06-15', status: 'Usable' },
  { id: 'BLD004', bloodGroup: 'AB+', units: 5, collectionDate: '2024-04-20', expiryDate: '2024-05-30', status: 'Quarantined' },
  { id: 'BLD005', bloodGroup: 'A-', units: 12, collectionDate: '2024-05-10', expiryDate: '2024-06-20', status: 'Usable' },
  { id: 'BLD006', bloodGroup: 'O+', units: 30, collectionDate: '2024-05-12', expiryDate: '2024-06-22', status: 'Usable' },
  { id: 'BLD007', bloodGroup: 'B-', units: 3, collectionDate: '2024-03-30', expiryDate: '2024-05-09', status: 'Expired' },
];

export const medicineInventory: Medicine[] = [
  { id: 'MED001', name: 'Paracetamol 500mg', stock: 1500, reorderPoint: 500, expiryDate: '2025-12-31', status: 'In Stock' },
  { id: 'MED002', name: 'Amoxicillin 250mg', stock: 450, reorderPoint: 500, expiryDate: '2025-08-31', status: 'Low Stock' },
  { id: 'MED003', name: 'Ibuprofen 200mg', stock: 800, reorderPoint: 300, expiryDate: '2026-01-31', status: 'In Stock' },
  { id: 'MED004', name: 'Metformin 500mg', stock: 250, reorderPoint: 200, expiryDate: '2025-10-31', status: 'In Stock' },
  { id: 'MED005', name: 'Saline Solution (1L)', stock: 95, reorderPoint: 100, expiryDate: '2025-11-30', status: 'Low Stock' },
  { id: 'MED006', name: 'Atorvastatin 20mg', stock: 0, reorderPoint: 150, expiryDate: '2025-09-30', status: 'Out of Stock' },
];

export async function getPatients() {
  return patients;
}

export async function getAppointments() {
    return appointments;
}

export async function getBloodStock() {
    return bloodStock;
}

export async function getMedicineInventory() {
    return medicineInventory;
}
