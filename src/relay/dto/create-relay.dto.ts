/* eslint-disable */


import { IsNumber, IsEnum,IsString, IsDateString } from 'class-validator';
//import { RelayType } from './relay.entity';


export enum RelayType {
    HEALTH = 'health',
    PERSONAL = 'personal',
    CAREER = 'career',
    FINANCIAL = 'financial',
  }


export class CreateRelayDto {
  @IsString()
  goal: string;

  @IsNumber()
  frequency: number;

  @IsEnum(RelayType)
  type: RelayType;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}

 