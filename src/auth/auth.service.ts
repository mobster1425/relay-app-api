/* eslint-disable */



import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import  User  from './user.entity';
import type { Repository } from 'typeorm';
import {
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    //return this.usersRepository.createUser(authCredentialsDto);
console.log(authCredentialsDto)
    const { email,username, password } = authCredentialsDto;
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = this.usersRepository.create({email, username, password: hashedPassword });
  
      try {
        await this.usersRepository.save(user);
        console.log('finally signed up')
      } catch (error) {
        if (error.code === '23505') {
          // duplicate username
          throw new ConflictException('Username already exists');
        } else {
          throw new InternalServerErrorException();
        }
      }
  }
/*
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    console.log(authCredentialsDto)
    const { email,username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where:{ email} });
console.log('user found when logging in is',user)
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      console.log('payload is=',payload)
      const accessToken: string = await this.jwtService.sign(payload);
      console.log('access token is',accessToken)
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
*/

async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
  console.log(authCredentialsDto);
  const { email, username, password } = authCredentialsDto;
  
  try {
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('user found when logging in is', user);
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      console.log('payload is=', payload);
      const accessToken: string = await this.jwtService.sign(payload);
      console.log('access token is', accessToken);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  } catch (error) {
    console.error('An error occurred during sign-in:', error);
    throw new InternalServerErrorException('An error occurred during sign-in');
  }
}



  async findOneByEmail(email: string): Promise<User | undefined> {
     return this.usersRepository.findOne({ where: { email } });
/*
    return this.usersRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.Progresses', 'progress')
    .leftJoinAndSelect('user.relays', 'relay')
    .leftJoinAndSelect('user.LikedProgresses', 'likedProgress')
    .leftJoinAndSelect('user.JoinedRelays', 'joinedRelay')
    .where('user.email = :email', { email })
    .getOne();
*/

  }

  async findOneByUserId(id: string): Promise<User | undefined> {
   // return this.usersRepository.findOne({ where: { id } });

    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.Progresses', 'progress')
      .leftJoinAndSelect('user.relays', 'relay')
      .leftJoinAndSelect('user.LikedProgresses', 'likedProgress')
      .leftJoinAndSelect('user.JoinedRelays', 'joinedRelay')
      .where('user.id = :id', { id })
      .getOne();
  }
  

}

