import { PlaceHolderImages } from './placeholder-images';

export type Doctor = {
    id: string;
    name: string;
    specialty: string;
    location: string;
    avatar: string;
};

export const doctors: Doctor[] = [
  { id: 'DOC001', name: 'Dr. Anjali Rao', specialty: 'Cardiologist', location: 'Mumbai, India', avatar: PlaceHolderImages.find(img => img.id === 'avatar-1')?.imageUrl || '' },
  { id: 'DOC002', name: 'Dr. Vikram Singh', specialty: 'Cardiologist', location: 'Delhi, India', avatar: 'https://picsum.photos/seed/doc2/100/100' },
  { id: 'DOC003', name: 'Dr. Priya Sharma', specialty: 'Dermatologist', location: 'Mumbai, India', avatar: 'https://picsum.photos/seed/doc3/100/100' },
  { id: 'DOC004', name: 'Dr. Rahul Verma', specialty: 'General Physician', location: 'Mumbai, India', avatar: 'https://picsum.photos/seed/doc4/100/100' },
  { id: 'DOC005', name: 'Dr. Sneha Reddy', specialty: 'Pediatrician', location: 'Bangalore, India', avatar: 'https://picsum.photos/seed/doc5/100/100' },
  { id: 'DOC006', name: 'Dr. Sameer Desai', specialty: 'General Physician', location_2: 'Delhi, India', location: 'Delhi, India', avatar: 'https://picsum.photos/seed/doc6/100/100' },
  { id: 'DOC007', name: 'Dr. Meera Iyer', specialty: 'Cardiologist', location: 'Mumbai, India', avatar: 'https://picsum.photos/seed/doc7/100/100' },
];
