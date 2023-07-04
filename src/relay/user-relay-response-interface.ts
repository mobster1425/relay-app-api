/* eslint-disable */

export interface GetUserRelaysResponse {
    myRelays: RelayDto1[];
    totalPoints: number;
  }
  
 export interface RelayDto1 {
    goal: string;
    start_date: Date;
    end_date: Date;
    total_points: number;
    total_teammates: number;
    status: string;
  }