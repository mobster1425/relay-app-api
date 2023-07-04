/* eslint-disable */
import  User  from '../auth/user.entity';
import {Exclude} from 'class-transformer';
import { Column, Entity, OneToMany,ManyToMany,ManyToOne,JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import Relay from '../relay/relay.entity';
@Entity()
export class Progress{
  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column()
  message!: string;

  @ManyToMany((_type) => User, (user) => user.LikedProgresses)
@JoinTable({ name: 'progress_liked_by_user' })  
LikedByUser:User[];

@ManyToOne((_type) => User, (user) => user.Progresses)
  @Exclude({ toPlainOnly: true })
  user: User;


@ManyToOne((_type) => Relay, (relay) => relay.Progresses)
  relay: Relay;

}
