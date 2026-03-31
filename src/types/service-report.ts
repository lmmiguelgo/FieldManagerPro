import { type Timestamp } from "firebase/firestore";

export interface PartUsed {
  partId: string;
  partName: string;
  quantity: number;
  unitCost: number;
}

export interface ServiceReport {
  id: string;
  ticketId: string;
  customerId: string;
  technicianId: string;
  customerName: string;
  customerAddress: string;
  technicianName: string;
  workPerformed: string;
  partsUsed: PartUsed[];
  laborHours: number;
  laborRate: number;
  totalCost: number;
  technicianSignature: string;
  customerSignature: string;
  photos: string[];
  notes?: string;
  locked: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
