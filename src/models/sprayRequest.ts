import { t } from "i18next";

export interface SprayRequest {
  id: number;
  request_id: string;
  farm_id: number;
  farmer_id: number;
  acreage: string;
  crop_id: number;
  crop_name: string;
  request_date: string;
  remarks: string | null;
  apply_coin: string;
  referral: string | null;

  status: 0 | 1 | 2; //0:rejected, 1:created, 2:accepted
  service_id: null | string;

  operator_ids: null | string;

  accepted_by: null | string;
  accepted_at: null | Date;
  rejected_remarks?: null | string;
  farmer_rejected_remarks?: null | string;

  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: null | Date;
}

export enum RequestStatus {
  Rejected = 0,
  Created = 1,
  Accepted = 2,
}

export const STATUS_LABEL: Record<number, string> = {
  [RequestStatus.Rejected]: t("status.rejected"),
  [RequestStatus.Created]: t("status.created"),
  [RequestStatus.Accepted]: t("status.accepted"),
};

export interface SprayRequestState {
  list: SprayRequest[];
  loading: boolean;
  error: string | null;
}
