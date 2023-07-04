/* eslint-disable */


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import  User  from './user.entity';
//import { UsersRepository } from './users.repository';
//import type { Repository } from 'typeorm';
import {AuthService}  from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
   // @InjectRepository(User)
   // private readonly usersRepository: Repository<User>,
   private  authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  //this validate function is like the middleware it creates the req.user like expressjs and validates the user token and email,
  //then it attaches the user object found from the findone function to the req.user, so through that we can access the user in every 
  //route
  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    console.log("email is ",email);
   // const user: User = await this.usersRepository.findOne({ where:{email} });
   const user: User = await this.authService.findOneByEmail(email);
   console.log('user found is',user)
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}


