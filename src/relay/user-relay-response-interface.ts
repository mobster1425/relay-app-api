/* eslint-disable */
import { RelayType } from "./dto/relay.dto";

export interface GetUserRelaysResponse {
    myRelays: RelayDto1[];
    totalPoints: number;
  }
  
 export interface RelayDto1 {
    goal: string;
    start_date: Date;
    end_date: Date;
    type: RelayType;
    total_points: number;
    total_teammates: number;
    status: string;
  }