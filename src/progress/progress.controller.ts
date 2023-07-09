/* eslint-disable */


import { Controller,Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import User  from '../auth/user.entity';
import  Relay  from '../relay/relay.entity';
import { ProgressService } from './progress.service';
//import { CreateProgressDto } from './dto/create-progress.dto';
import { Progress } from './progress.entity';
import { RelayService } from 'src/relay/relay.service';
import { Injectable, NotFoundException, ConflictException,InternalServerErrorException, Logger } from '@nestjs/common';
import {AuthService} from '../auth/auth.service';



@Controller('progress')
@UseGuards(AuthGuard())
export class ProgressController {
  constructor(private progressService: ProgressService,private relayService: RelayService,
    private authService: AuthService
) {}
  @Post(':relayId')
 async createProgress(
    @Param('relayId') relayId: string,
    @Body() message:string,
    @GetUser() user: User,
  ): Promise<Progress> {
    const relay: Relay = await this.relayService.findRelayByIdforprogress(relayId);
  // const relay = await this.relayService.findOne({where: {id}});
  console.log("relay is=",relay)
    if (!relay) {
      // Handle relay not found error
      // For example:
      throw new NotFoundException('Relay not found');
    }

    return this.progressService.createProgress(user, relay, message);
  
  }
  

  @Post('/like/:progressId/like')
 async likeProgress(
    @Param('progressId') id: string,
    @GetUser() user: User,
  ): Promise<Progress> {
    const userfound: User = await this.authService.findOneByUserId(user.id);
    return this.progressService.likeProgress(id, userfound);
  }


 @Get('point/:relayId')
 async getPointsByUserforarelay(  @Param('relayId') relayId: string,@GetUser() user: User): Promise<number> {

  const relay: Relay = await this.relayService.findRelayByIdforprogress(relayId);
  console.log("relay found here is =",relay)
    if (!relay) {
      // Handle relay not found error
      // For example:
      throw new NotFoundException('Relay not found');
    }

    return this.progressService.getPointsByUser(relay,user);
  }

  @Get('relay/:relayId')
  async getProgressesForRelay(@Param('relayId') relayId: string) {
    return this.progressService.getProgressesForRelay(relayId);
  }

}

