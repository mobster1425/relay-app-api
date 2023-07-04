/* eslint-disable */


import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import  User  from '../auth/user.entity';
import { CreateRelayDto } from './dto/create-relay.dto';
//import { RelayType } from './relay.entity';
import { RelayType } from './dto/create-relay.dto';
import Relay from './relay.entity';
import { RelayService } from './relay.service';
//import {RelayDto} from '.dto/relay.dto';
import {RelayDto} from './dto/relay.dto';
import { GetUserRelaysResponse,RelayDto1 } from './user-relay-response-interface';
import {AuthService} from '../auth/auth.service';



@Controller('relays')
@UseGuards(AuthGuard())
export class RelayController {
  constructor(private relayService: RelayService,private authService: AuthService) {}

  @Post()
  createRelay(
    @Body() createRelayDto: CreateRelayDto,
    @GetUser() user: User,
  ): Promise<Relay> {
    return this.relayService.createRelay(createRelayDto, user);
  }

  @Get('relaytype/:relayType')
  findRelaysByType(@Param('relayType') relayType: RelayType): Promise<RelayDto[]> {
    return this.relayService.findRelaysByType(relayType);
  }

  @Get('relayid/:id')
  findRelayById(@Param('id') id: string): Promise<RelayDto> {
    return this.relayService.findRelayById(id);
  }

  @Post('/:id/join')
 async joinRelay(@Param('id') id: string, @GetUser() user: User): Promise<Relay> {
    const userfound: User = await this.authService.findOneByUserId(user.id);
    return this.relayService.joinRelay(id, userfound);
  }

  @Get('/userRelays')
  getUserRelays(@GetUser() user: User): Promise<GetUserRelaysResponse> {
    return this.relayService.getUserRelays(user);
  }
}


