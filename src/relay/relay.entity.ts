/* eslint-disable */

import { Entity, PrimaryGeneratedColumn, Column,OneToMany, ManyToMany,ManyToOne,JoinTable } from 'typeorm';
import User from '../auth/user.entity';
import {Exclude} from 'class-transformer';
import { Progress } from 'src/progress/progress.entity'; 

 enum RelayType {
  HEALTH = 'health',
  PERSONAL = 'personal',
  CAREER = 'career',
  FINANCIAL = 'financial',
}

@Entity()
  class Relay {
  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column()
  goal!: string;

  @Column({
    type: 'enum',
    enum: RelayType,
    default: RelayType.HEALTH,
  })
  type!: RelayType;

  @Column()
  frequency!: number;

  @Column()
  start_date!: Date;

  @Column()
  end_date!: Date;

  @Column()
points: number;

@ManyToOne((_type) => User, (user) => user.relays )
  @Exclude({ toPlainOnly: true })
  user: User;


@ManyToMany((_type) => User, (user) => user.JoinedRelays )
@JoinTable({name: 'user_joined_relays_relay'})  
RelayJoinedByUser: User[];


@OneToMany((_type) => Progress, (progress) => progress.relay )
@Exclude({ toPlainOnly: true })
  Progresses: Progress[];


}

export default Relay;


