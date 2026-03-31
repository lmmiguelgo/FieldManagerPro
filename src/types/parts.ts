import { type Timestamp } from "firebase/firestore";

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  description?: string;
  quantity: number;
  unitCost: number;
  supplier?: string;
  minimumStock: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
