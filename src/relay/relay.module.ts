/* eslint-disable */


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RelayController } from './relay.controller';
import  User  from '../auth/user.entity';
import { RelayService } from './relay.service';
import Relay from './relay.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Relay,User]),AuthModule],
  controllers: [RelayController],
  providers: [RelayService],
  exports: [RelayService],
})
export class RelayModule{}