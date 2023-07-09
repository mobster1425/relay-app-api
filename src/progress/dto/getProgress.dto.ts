/* eslint-disable */

export interface GetProgressesResponse {
    progresses: ProgressDto[];
    relay: RelayDto3;
  }
  enum RelayType {
    HEALTH = 'health',
    PERSONAL = 'personal',
    CAREER = 'career',
    FINANCIAL = 'financial',
  }

  export interface ProgressDto {
    id: string;
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
    totalLikes: number;
  }
  
  export interface RelayDto3 {
    id: string;
    goal: string;
    type: RelayType;
    frequency: number;
    start_date: Date;
    end_date: Date;
    // Include other relay properties if needed
  }