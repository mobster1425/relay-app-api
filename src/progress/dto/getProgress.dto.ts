/* eslint-disable */

export interface GetProgressesResponse {
    progresses: ProgressDto[];
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
    relay: {
      id: string;
      goal: string;
    type: RelayType;
    frequency: number;
    start_date: Date;
    end_date: Date;
      // Include other relay properties if needed
    };
    totalLikes: number;
  }
  