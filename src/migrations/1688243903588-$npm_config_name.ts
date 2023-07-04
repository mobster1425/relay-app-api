import { MigrationInterface, QueryRunner } from "typeorm";


export class $npmConfigName1688243903588 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        CREATE TABLE "user" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "username" character varying NOT NULL,
          "email" character varying NOT NULL,
          "password" character varying NOT NULL,
          CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
          CONSTRAINT "UQ_user_username" UNIQUE ("username"),
          CONSTRAINT "UQ_user_email" UNIQUE ("email")
        );
  
        CREATE TYPE "relay_type_enum" AS ENUM ('health', 'personal', 'career', 'financial');
  
        CREATE TABLE "relay" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "goal" character varying NOT NULL,
          "type" "relay_type_enum" NOT NULL DEFAULT 'health',
          "frequency" integer NOT NULL,
          "start_date" timestamp without time zone NOT NULL,
          "end_date" timestamp without time zone NOT NULL,
          "points" integer NOT NULL,
          "userId" uuid,
          CONSTRAINT "PK_relay_id" PRIMARY KEY ("id"),
          CONSTRAINT "FK_relay_userId_user_id" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        );
  
        CREATE TABLE "progress" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "message" character varying NOT NULL,
          "userId" uuid,
          "relayId" uuid,
          CONSTRAINT "PK_progress_id" PRIMARY KEY ("id"),
          CONSTRAINT "FK_progress_userId_user_id" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT "FK_progress_relayId_relay_id" FOREIGN KEY ("relayId") REFERENCES "relay"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        );
  
        CREATE TABLE "user_joined_relays_relay" (
          "userId" uuid NOT NULL,
          "relayId" uuid NOT NULL,
          CONSTRAINT "PK_user_joined_relays_relay" PRIMARY KEY ("userId", "relayId"),
          CONSTRAINT "FK_user_joined_relays_relay_userId_user_id" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "FK_user_joined_relays_relay_relayId_relay_id" FOREIGN KEY ("relayId") REFERENCES "relay"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
  
        CREATE TABLE "progress_liked_by_user" (
          "progressId" uuid NOT NULL,
          "userId" uuid NOT NULL,
          CONSTRAINT "PK_progress_liked_by_user" PRIMARY KEY ("progressId", "userId"),
          CONSTRAINT "FK_progress_liked_by_user_progressId_progress_id" FOREIGN KEY ("progressId") REFERENCES "progress"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "FK_progress_liked_by_user_userId_user_id" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        DROP TABLE "progress_liked_by_user";
        DROP TABLE "user_joined_relays_relay";
        DROP TABLE "progress";
        DROP TABLE "relay";
        DROP TABLE "user";
      `);

    }

}
