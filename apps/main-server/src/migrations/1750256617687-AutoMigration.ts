import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1750256617687 implements MigrationInterface {
  name = 'AutoMigration1750256617687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "user_name" character varying(100) NOT NULL, "email" character varying(255), "password" character varying(255), "last_name" character varying(100) NOT NULL, "first_name" character varying(100) NOT NULL, "middle_name" character varying(100), "gender" "public"."user_gender_enum", "date_of_birth" TIMESTAMP WITH TIME ZONE, "honorific" "public"."user_honorific_enum", "oauth_provider" character varying(100), "oauth_id" character varying(100), "avatar_image" character varying(255), "email_verified" boolean NOT NULL DEFAULT false, "profile_completed" boolean NOT NULL DEFAULT true, "refresh_token" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "session_version" character varying(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d34106f8ec1ebaf66f4f8609dd" ON "user" ("user_name") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "service_id" character varying(100) NOT NULL, "service_secret" text NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_48c5a0e13da2b2948fb7f3a0c4a" UNIQUE ("service_id"), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "name" character varying(255) NOT NULL, "description" character varying(255), CONSTRAINT "UQ_3c1689c77e9b177ef1323e92d4f" UNIQUE ("name"), CONSTRAINT "PK_42a3f102470c2b194b9bafc1f07" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "name" character varying(255) NOT NULL, "description" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "org_type_id" uuid NOT NULL, CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."role_role_source_enum" AS ENUM('org', 'type')`);
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "code" character varying(255) NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, "role_source" "public"."role_role_source_enum" NOT NULL DEFAULT 'type', "organizationTypeId" uuid, "organizationId" uuid, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ee999bb389d7ac0fd967172c41" ON "role" ("code") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3551ef7cbf25d2e49b1665bc55" ON "role" ("name", "role_source", "organizationTypeId", "organizationId") `
    );
    await queryRunner.query(
      `CREATE TABLE "service_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "service_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_8dea164127ed2ef877a1a6ec287" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c8ed18ff47475e2c4a7bf59daa" ON "resource" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "name" character varying(512) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "fields" text array, "condition" jsonb, "is_active" boolean NOT NULL DEFAULT true, "resource_id" uuid NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_240853a0c3353c25fb12434ad3" ON "permission" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "name" character varying(512) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "permission_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_401d840f6b1957fa74ac631c61" ON "role_permission" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "action" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4aa35beeebe7073b51be93aae6" ON "action" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "permission_action" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "permission_id" uuid NOT NULL, "action_id" uuid NOT NULL, CONSTRAINT "PK_558a8b5ec76ab386a4c2e903f39" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_organization_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "name" character varying(512) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "organization_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_af7e0d9e6a5a3001b829ced9500" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53ae85ce1133f2992bfe242d47" ON "user_organization_role" ("user_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b87b3b8bd97142de2c54dd4d67" ON "user_organization_role" ("organization_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f5c86bce22799ea96da511092" ON "user_organization_role" ("role_id") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_uor_name" ON "user_organization_role" ("name") `
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_32a98b1f3966745ebfd18f7955d" FOREIGN KEY ("org_type_id") REFERENCES "organization_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_25ff5fc261ad2318bb4a427dab3" FOREIGN KEY ("organizationTypeId") REFERENCES "organization_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "service_role" ADD CONSTRAINT "FK_de14f0d28528ba981fd4238373f" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "service_role" ADD CONSTRAINT "FK_cd5d56f86e66e8db590859c321d" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_8cb319db6c644b6e59b98bdfd98" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" ADD CONSTRAINT "FK_e7c0659735f8c0d9a77bce95170" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" ADD CONSTRAINT "FK_8d6892f5dba9517b009bab7f764" FOREIGN KEY ("action_id") REFERENCES "action"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" ADD CONSTRAINT "FK_53ae85ce1133f2992bfe242d47c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" ADD CONSTRAINT "FK_b87b3b8bd97142de2c54dd4d67a" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" ADD CONSTRAINT "FK_7f5c86bce22799ea96da511092d" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" DROP CONSTRAINT "FK_7f5c86bce22799ea96da511092d"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" DROP CONSTRAINT "FK_b87b3b8bd97142de2c54dd4d67a"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" DROP CONSTRAINT "FK_53ae85ce1133f2992bfe242d47c"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" DROP CONSTRAINT "FK_8d6892f5dba9517b009bab7f764"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" DROP CONSTRAINT "FK_e7c0659735f8c0d9a77bce95170"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_8cb319db6c644b6e59b98bdfd98"`
    );
    await queryRunner.query(
      `ALTER TABLE "service_role" DROP CONSTRAINT "FK_cd5d56f86e66e8db590859c321d"`
    );
    await queryRunner.query(
      `ALTER TABLE "service_role" DROP CONSTRAINT "FK_de14f0d28528ba981fd4238373f"`
    );
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_25ff5fc261ad2318bb4a427dab3"`);
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_32a98b1f3966745ebfd18f7955d"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_uor_name"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7f5c86bce22799ea96da511092"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b87b3b8bd97142de2c54dd4d67"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_53ae85ce1133f2992bfe242d47"`);
    await queryRunner.query(`DROP TABLE "user_organization_role"`);
    await queryRunner.query(`DROP TABLE "permission_action"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4aa35beeebe7073b51be93aae6"`);
    await queryRunner.query(`DROP TABLE "action"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_401d840f6b1957fa74ac631c61"`);
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_240853a0c3353c25fb12434ad3"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c8ed18ff47475e2c4a7bf59daa"`);
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(`DROP TABLE "service_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3551ef7cbf25d2e49b1665bc55"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ee999bb389d7ac0fd967172c41"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_role_source_enum"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "organization_type"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d34106f8ec1ebaf66f4f8609dd"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
