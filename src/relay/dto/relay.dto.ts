/* eslint-disable */


import { IsNumber, IsEnum,IsString, IsDateString } from 'class-validator';
//import { RelayType } from './relay.entity';


export enum RelayType {
    HEALTH = 'health',
    PERSONAL = 'personal',
    CAREER = 'career',
    FINANCIAL = 'financial',
  }


  export class RelayDto {
    id: string;
    goal: string;
    type: RelayType;
    frequency: number;
    start_date: Date;
    end_date: Date;
    points: number;
    participantCount: number;
  }
  