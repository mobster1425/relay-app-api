/* eslint-disable */

import { Column, Entity,ManyToMany, OneToMany, PrimaryGeneratedColumn,JoinTable } from 'typeorm';
import Relay from '../relay/relay.entity';
import { Progress } from 'src/progress/progress.entity'; 
import { Exclude, Expose } from 'class-transformer';
@Entity()
   class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

@Column({ unique: true })
  email!: string;


  @Column()
  @Exclude()
  password!: string;

 @OneToMany((_type) => Progress,(progress) => progress.user)
 Progresses:Progress[];


@OneToMany((_type) => Relay, (relay) => relay.user )
  relays: Relay[];

@ManyToMany((_type) => Progress, (progress) => progress.LikedByUser )
@JoinTable({ name: 'progress_liked_by_user' }) 
@Exclude()
LikedProgresses: Progress[];

@ManyToMany((_type) => Relay, (relay) => relay.RelayJoinedByUser )
@JoinTable({name: 'user_joined_relays_relay'})  
@Exclude()
JoinedRelays: Relay[];


}

export default User;

