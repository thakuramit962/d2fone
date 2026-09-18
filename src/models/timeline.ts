export interface TimelineBase {
  available: boolean;
  at?: string;
  by?: string;
  status: string;
  color?: string;
}

export interface DeliveredTimeline extends TimelineBase {
  refundSignature?: string;
  amountReceived?: number;
  accessAmount?: number;
  refundAmount?: number;
}

export interface CompletedTimeline extends TimelineBase {
  requestedAcreage?: number;
  sprayedAcreage?: number;
  droneAcreage?: number;
  effectiveAmount?: number;
  effectiveDiscount?: number;
  effectivePayable?: number;
  accessAmount?: number;
  refundAmount?: number;
  farmerSign?: string;
  farmerImage?: string;
  farmImage?: string;
}

export interface StartedTimeline extends TimelineBase {
  availablePerson?: string;
  freshWater?: string;
  chemicals?: string;
  noc?: string;
}

export interface CancelTimeline extends TimelineBase {
  cancelRemarks?: string;
}

export interface AcknowledgedTimeline extends TimelineBase {}

export interface AssignedTimeline extends TimelineBase {
  name?: string;
  phone?: string;
  asset?: string;
}

export interface CreatedTimeline extends TimelineBase {
  amountReceived?: number;
  payment_type?: "1" | "2" | null;
}

export interface UpdatedTimeline extends TimelineBase {
  remarks?: string;
}

// Main interface type
export interface TimelineData {
  delivered?: DeliveredTimeline;
  completed?: CompletedTimeline;
  started?: StartedTimeline;
  cancel?: CancelTimeline;
  acknowledged?: AcknowledgedTimeline;
  assigned?: AssignedTimeline;
  created?: CreatedTimeline;
  updated?: UpdatedTimeline;
}
