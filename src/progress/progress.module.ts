/* eslint-disable */



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { RelayModule } from '../Relay/Relay.module';
import { RelayModule } from '../relay/relay.module';
import { AuthModule } from '../auth/auth.module';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { Progress } from './progress.entity';
import Relay from '../relay/relay.entity';
import User from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Progress,Relay,User]),RelayModule,AuthModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
