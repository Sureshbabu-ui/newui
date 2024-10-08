import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface SlaDetail {
  IsVipProduct: boolean,
  IsEnterpriseProduct: boolean,
  ResponseTimeInHours: number,
  ResolutionTimeInHours: number,
  StandByTimeInHours: number,
}

export const slaDetailDecoder: Decoder<SlaDetail> = object({
  IsVipProduct: boolean,
  IsEnterpriseProduct: boolean,
  ResponseTimeInHours: number,
  ResolutionTimeInHours: number,
  StandByTimeInHours: number,
});

export interface SlaDetails {
  SlaDetails: SlaDetail;
}

export const slaDetailsDecoder: Decoder<SlaDetails> = object({
  SlaDetails: slaDetailDecoder,
});