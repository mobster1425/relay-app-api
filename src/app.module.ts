/* eslint-disable */




import { Module } from '@nestjs/common';
import { ProgressModule } from './progress/progress.module';
import { RelayModule } from './relay/relay.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { configValidationSchema } from './config.schema';
//import { DatabaseModule,connectionSource } from './database/database.module';
//import { getEnvPath } from './helper/env.helper';
import * as Joi from '@hapi/joi';
import typeorm from './config/typeorm';

//const envFilePath: string = getEnvPath(`${__dirname}/envs`);

@Module({
  imports: [
    /*
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    */

    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
/*
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...connectionSource,
        migrations: ['./migrations/*{.ts,.js}'],
        synchronize: true,
      }),
    }),
    */

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),

    RelayModule,
ProgressModule,
  // DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}

