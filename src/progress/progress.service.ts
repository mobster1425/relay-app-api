/* eslint-disable */



import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Progress } from './progress.entity';
import  User  from '../auth/user.entity';
import  Relay  from '../relay/relay.entity';
import type { Repository } from 'typeorm';
import { GetProgressesResponse,ProgressDto,RelayDto3 } from './dto/getProgress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    @InjectRepository(Relay)
    private readonly relayRepository: Repository<Relay>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createProgress(user: User, relay: Relay, message:string): Promise<Progress> {

   // return this.progressRepository.createProgress(user, relay, message);
   console.log("user in progress is =",user)
   const progress = this.progressRepository.create({
    user,
    relay,
    message,
  });
  
  
  await this.progressRepository.save(progress);

  // Increment points by 5 for the relay associated with the progress
  // await progress.relay.points += 5;
  relay.points += 5;
  
  await this.relayRepository.save(relay);
  console.log("relay point is=",relay.points);

  return progress;



  }

  async likeProgress(id:string, userfound: User): Promise<Progress> {
   // return this.progressRepository.likeProgress(progress, user);
   //const progress=await this.progressRepository.findOne({where:{id}});
console.log("progress id =",id)
   const progress = await this.progressRepository
   .createQueryBuilder('progress')
   .leftJoinAndSelect('progress.LikedByUser', 'likedUser')
   .where('progress.id = :id', { id })
   .getOne();

   console.log("progress found =",progress)

   if (!progress) {
    throw new NotFoundException(`Progress with ID ${id} not found`);
  }
console.log("before liking progress")
   // progress.LikedByUser.push(user);
   progress.LikedByUser.push(userfound);
   userfound.LikedProgresses.push(progress);
   console.log("progess liked by user=",progress.LikedByUser)
   console.log("user liked progresses in the user entity =",userfound.LikedProgresses)
console.log("after liking progress")
await this.userRepository.save(userfound); // Save the updated User entity
console.log("user entity updated")
   await this.progressRepository.save(progress);
   console.log("progress repository updated")
  
   console.log("progress saved")
   return progress;

  }

  async getPointsByUser(relay:Relay,user: User): Promise<number> {
  
console.log("relay id is =",relay.id)



  const result = await this.progressRepository
    .createQueryBuilder('progress')
    .leftJoinAndSelect('progress.relay', 'relay')
    .where('progress.user = :userId', { userId: user.id }) // Use user's ID for comparison
    .andWhere('relay.id = :relayId', { relayId: relay.id })
    .getOne();




console.log("results is =",result)
// console.log("result point is =",result.points)
console.log("result points =", result?.relay?.points);

return result?.relay?.points || 0;
}



async getProgressesForRelay(relayId: string): Promise<GetProgressesResponse> {
  try {
    const progresses = await this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.relay', 'relay')
      .leftJoinAndSelect('progress.user', 'user')
      .leftJoinAndSelect('progress.LikedByUser', 'likedUser')
      .where('relay.id = :relayId', { relayId })
      .getMany();
console.log("progresses =",progresses)
    const formattedProgresses: ProgressDto[] = progresses.map(progress => ({
      id: progress.id,
      message: progress.message,
      user: {
        id: progress.user.id,
        username: progress.user.username,
        email: progress.user.email,
      },
      totalLikes: progress.LikedByUser.length,
    }));

    const relay: RelayDto3 = {
      id: progresses[0]?.relay?.id,
      goal: progresses[0]?.relay?.goal,
      frequency: progresses[0]?.relay?.frequency,
      start_date: progresses[0]?.relay?.start_date,
      end_date: progresses[0]?.relay?.end_date,
      type: progresses[0]?.relay?.type,
      // Include other relay properties if needed
    };


    console.log("formatted progresses is=",formattedProgresses)
    console.log("formatted relay=",relay)
    return { progresses: formattedProgresses, relay };
  } catch (error) {
    throw new Error('Failed to retrieve progresses for relay');
  }
}


  
}
