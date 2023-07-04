/* eslint-disable */



import { Injectable, NotFoundException, ConflictException,InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
//import {RelayType } from './relay.entity';
import { RelayType } from './dto/create-relay.dto';
import Relay from './relay.entity';
import { CreateRelayDto } from './dto/create-relay.dto';
import  User  from '../auth/user.entity';
import { GetUserRelaysResponse,RelayDto1 } from './user-relay-response-interface';
//import {RelayDto} from '.dto/relay.dto';
import {RelayDto} from './dto/relay.dto';


@Injectable()
export class RelayService {
  constructor(
    @InjectRepository(Relay)
    private readonly relayRepository: Repository<Relay>,
    @InjectRepository(User) // Add this line
    private readonly userRepository: Repository<User>, 
  ) {}
  private readonly logger = new Logger(RelayService.name);
/*
  async createRelay(createRelayDto: CreateRelayDto, user:User): Promise<Relay> {
    //return this.relayRepository.createRelay(createRelayDto,user);
    const { goal, frequency, type, startDate, endDate } = createRelayDto;
console.log('createrelaydto =',createRelayDto)
    const relay = this.relayRepository.create({
      goal,
      frequency,
      type,
     user,
      start_date:startDate,
      end_date:endDate,
      points: 0, // Initialize points to 0
    });
console.log('relay before been saved =',relay)
    await this.relayRepository.save(relay);
console.log('relay saved is =',relay)
    return relay;
  }
  */


  async createRelay(createRelayDto: CreateRelayDto, user: User): Promise<Relay> {
    try {
      const { goal, frequency, type, startDate, endDate } = createRelayDto;
      console.log('createrelaydto =', createRelayDto);
  console.log('user =',user)
      const relay =  this.relayRepository.create({
        goal,
        frequency,
        type,
        user,
        start_date: startDate,
        end_date: endDate,
        points: 0, // Initialize points to 0
      });
      console.log('relay before been saved =', relay);
  
      await this.relayRepository.save(relay);
      console.log('relay saved is =', relay);
  
      return relay;
    } catch (error) {
      // Handle the error here
      console.error('Error occurred while creating relay:', error);
      throw error; // Rethrow the error or handle it as per your requirements
    }
  }
  

  async findRelaysByType(relayType: RelayType): Promise<RelayDto[]> {
  //  const relays = await this.relayRepository.find({ where: { type: relayType } });

  const relays = await this.relayRepository
  .createQueryBuilder('relay')
  .leftJoinAndSelect('relay.RelayJoinedByUser', 'joinedUser')
  .leftJoinAndSelect('relay.user', 'user')
  .where('relay.type = :relayType', { relayType })
  .getMany();

    console.log('relay found by type =', relays)
    const relayDtos: RelayDto[] = [];
  
    for (const relay of relays) {
     
      const participantCount =  relay.RelayJoinedByUser.length;
      console.log("participant count =", participantCount)
      const relayDto: RelayDto = { ...relay, participantCount };
      relayDtos.push(relayDto);
    }
  console.log("new relay dto=",relayDtos);
    return relayDtos;
  }



/*
  async findRelaysByType(relayType:RelayType ): Promise<Relay[]> {
   
   // return this.relayRepository.findRelaysByType(relayType);

   const relayfoundbytype= await this.relayRepository.find({ where: { type: relayType } });
   console.log('relay found by type =', relayfoundbytype)
return relayfoundbytype;


  }
*/



async findRelayById(id: string): Promise<RelayDto> {
  //console.log('id =',id)
 // const relay = await this.relayRepository.findOne({ where: { id } });

 console.log('id =', id);
 const relay = await this.relayRepository
   .createQueryBuilder('relay')
   .leftJoinAndSelect('relay.RelayJoinedByUser', 'joinedUser')
   .leftJoinAndSelect('relay.user', 'user')
   .where('relay.id = :id', { id })
   .getOne();




  console.log("relay found =",relay)
  if (!relay) {
    throw new NotFoundException(`Relay with ID ${id} not found`);
  }

  const participantCount =  relay.RelayJoinedByUser.length;
  console.log("participant count =",participantCount)
  const relayDto: RelayDto = { ...relay, participantCount };

  return relayDto;
}














  async findRelayByIdforprogress(id: string): Promise<Relay> {
    //return this.relayRepository.findRelayById(relayId);
    // console.log('id =',id)
   // const relay = await this.relayRepository.findOne({ where: {id} });
   console.log('id =', id.trim()); // Trim the relayId parameter
   const relay = await this.relayRepository.findOne({ where: { id: id.trim() } });
/*
   const relay = await this.relayRepository
   .createQueryBuilder('relay')
   .leftJoinAndSelect('relay.progresses', 'progress')
   .where('relay.id = :id', { id })
   .getOne();
*/
    console.log("relay found =",relay)
    if (!relay) {
      throw new NotFoundException(`Relay with ID ${id} not found`);
    }
    return relay;


  }
  





  async joinRelay(id: string, userfound: User): Promise<Relay> {
    //return this.relayRepository.joinRelay(relayId, user);
  //  const relay = await this.relayRepository.findOne({where: {id},
    //  relations: ['RelayJoinedByUser'], });

    const relay = await this.relayRepository
    .createQueryBuilder('relay')
    .leftJoinAndSelect('relay.RelayJoinedByUser', 'JoinedUser')
    .leftJoinAndSelect('relay.user', 'user')
    .where('relay.id = :id', { id })
    .getOne();


      if (!relay) {
        throw new NotFoundException('Relay not found');
      }

      if (relay.user.id === userfound.id) {
        throw new ConflictException('User cannot join their own relay');
      }


    console.log("user found in joinedrelay =", userfound)
console.log("relay found here is =",relay)
    if (relay.start_date <= new Date()) {
      throw new Error('Cannot join relay after the start date');
    }

    const isUserAlreadyJoined =  relay.RelayJoinedByUser.some((joinedUser) => joinedUser.id === userfound.id);
    console.log("user joined is=",isUserAlreadyJoined)
    if (isUserAlreadyJoined) {
      throw new ConflictException('User has already joined the relay');
    }

    console.log('user:', userfound);
    console.log('user.JoinedRelays:', userfound.JoinedRelays);

    // relay.RelayJoinedByUser.push(userfound);
    relay.RelayJoinedByUser.push(userfound);
    // userfound.JoinedRelays.push(relay);
    userfound.JoinedRelays.push(relay);

    //  await this.relayRepository.save(userfound);
    await this.userRepository.save(userfound);
      await this.relayRepository.save(relay);

console.log("saved finish")
    return relay;

  }


async getUserRelays(user:User): Promise<GetUserRelaysResponse> {
   // return this.relayRepository.getUserRelays(user);

   try {
    // Find all relays created by the user
    /*
    const createdRelays = await this.relayRepository.find({
      where: { user: { id: user.id } },
    });
*/
const createdRelays = await this.relayRepository
  .createQueryBuilder('relay')
  .leftJoinAndSelect('relay.RelayJoinedByUser', 'users')
  .where('relay.user = :userId', { userId: user.id })
  .getMany();




console.log("created relays are =",createdRelays)

    // Find all relays joined by the user
    const joinedRelays = await this.relayRepository.createQueryBuilder('relay')
      .innerJoinAndSelect('relay.RelayJoinedByUser', 'users')
      .where('users.id = :userid', { userid: user.id } )
      .getMany();

console.log("join relays are =",joinedRelays)


    const  formatRelay =  (relay: Relay): RelayDto1 => {
     // const teammates =  relay.RelayJoinedByUser;
      return {
        goal: relay.goal,
        start_date: relay.start_date,
        end_date: relay.end_date,
        total_points: relay.points,
       // total_teammates: relay.RelayJoinedByUser.length,
       total_teammates: relay.RelayJoinedByUser ? relay.RelayJoinedByUser.length : 0,
        status: getStatus(relay.start_date, relay.end_date),
      };
    };

console.log("after formatting")

    const getStatus = (startDate: Date, endDate: Date): string => {
      const currentDate = new Date();
      if (currentDate < startDate) {
        return 'Not Started';
      } else if (currentDate > endDate) {
        return 'Completed';
      } else {
        return 'Active';
      }
    };

console.log("after function get status")

    const myRelays = createdRelays.map(formatRelay).concat(joinedRelays.map(formatRelay));


console.log("after my relays mapping with joined relays =",myRelays)

    // Calculate total points
    let totalPoints = 0;
    createdRelays.forEach((relay) => {
      totalPoints += relay.points;
    });

console.log("after getting total point , total point =",totalPoints)

    return { myRelays, totalPoints };
  } catch (error) {
   this.logger.error(`Failed to get user relays for userid: ${user.id}`, error.stack);
    throw new InternalServerErrorException('Failed to retrieve user relays');
  }
}
}



