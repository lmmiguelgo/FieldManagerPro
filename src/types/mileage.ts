import { type Timestamp } from "firebase/firestore";

export interface MileageLog {
  id: string;
  technicianId: string;
  ticketId?: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  totalDistanceMiles: number;
  status: "active" | "completed" | "interrupted";
  isEstimated?: boolean;
  createdAt: Timestamp;
}

export interface MileageCoordinate {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: Timestamp;
  batchId: string;
}
