import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1761146187636 implements MigrationInterface {
  name = 'AutoMigration1761146187636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization_type" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(255) DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_3c1689c77e9b177ef1323e92d4f" UNIQUE ("name"), CONSTRAINT "PK_42a3f102470c2b194b9bafc1f07" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "org_type_id" uuid NOT NULL, CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female')`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_honorific_enum" AS ENUM('Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.', 'Rev.', 'Sir', 'Madam', 'Lady', 'Lord', 'Capt.', 'Maj.', 'Col.', 'Lt.')`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying(100) NOT NULL, "email" character varying(255), "password" character varying(255), "last_name" character varying(100) NOT NULL, "first_name" character varying(100) NOT NULL, "middle_name" character varying(100), "gender" "public"."user_gender_enum", "date_of_birth" TIMESTAMP WITH TIME ZONE, "honorific" "public"."user_honorific_enum", "oauth_provider" character varying(100), "oauth_id" character varying(100), "avatar_image" character varying(255), "email_verified" boolean NOT NULL DEFAULT false, "profile_completed" boolean NOT NULL DEFAULT true, "refresh_token" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "session_version" character varying(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d34106f8ec1ebaf66f4f8609dd" ON "user" ("user_name") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c8ed18ff47475e2c4a7bf59daa" ON "resource" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "action" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4aa35beeebe7073b51be93aae6" ON "action" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "permission_action" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "permission_id" uuid NOT NULL, "action_id" uuid NOT NULL, CONSTRAINT "PK_558a8b5ec76ab386a4c2e903f39" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(512) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "fields" text array, "condition" jsonb, "is_active" boolean NOT NULL DEFAULT true, "resource_id" uuid NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_240853a0c3353c25fb12434ad3" ON "permission" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(512) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "permission_id" uuid NOT NULL, "role_id" uuid NOT NULL, "permissionId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_401d840f6b1957fa74ac631c61" ON "role_permission" ("name") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."role_role_source_enum" AS ENUM('org', 'type', 'error')`
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(255) NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, "role_source" "public"."role_role_source_enum" NOT NULL DEFAULT 'type', "organization_type_id" uuid, "organization_id" uuid, "organizationTypeId" uuid, "organizationId" uuid, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ee999bb389d7ac0fd967172c41" ON "role" ("code") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3551ef7cbf25d2e49b1665bc55" ON "role" ("name", "role_source", "organizationTypeId", "organizationId") `
    );
    await queryRunner.query(
      `CREATE TABLE "user_organization_role" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(512) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "userId" uuid NOT NULL, "organizationId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "uq_uor_user_org_role" UNIQUE ("userId", "organizationId", "roleId"), CONSTRAINT "PK_af7e0d9e6a5a3001b829ced9500" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "ix_uor_role" ON "user_organization_role" ("roleId") `);
    await queryRunner.query(
      `CREATE INDEX "ix_uor_org" ON "user_organization_role" ("organizationId") `
    );
    await queryRunner.query(`CREATE INDEX "ix_uor_user" ON "user_organization_role" ("userId") `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_uor_name" ON "user_organization_role" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "service_id" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "base_url" character varying NOT NULL, "aud_prefix" character varying NOT NULL DEFAULT 'api://', "routes" jsonb NOT NULL DEFAULT '[]', "required_scopes" text array NOT NULL DEFAULT '{}', "health_check_path" character varying, "owner_team" character varying, "service_secret" text NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT false, "secret_version" integer NOT NULL DEFAULT '1', "last_rotated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_48c5a0e13da2b2948fb7f3a0c4a" UNIQUE ("service_id"), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "email_suppression" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "reason" character varying(64) NOT NULL, CONSTRAINT "PK_7c01fd4660a34be4ff82d235f72" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c799e37d31dc4930aa36f7d483" ON "email_suppression" ("email") `
    );
    await queryRunner.query(
      `CREATE TABLE "email_receipt" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider_message_id" character varying(256) NOT NULL, "event" character varying(64) NOT NULL, "payload" jsonb, CONSTRAINT "UQ_8b37f8d324287f49ffb44550a26" UNIQUE ("provider_message_id"), CONSTRAINT "PK_9d626545ebec85c7ff9c7e63ca2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b37f8d324287f49ffb44550a2" ON "email_receipt" ("provider_message_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6463cd0c29ed19c57b895d8c2d" ON "email_receipt" ("event") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_outbox_channel_enum" AS ENUM('transactional', 'marketing')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_outbox_status_enum" AS ENUM('queued', 'sending', 'sent', 'delivered', 'bounced', 'complained', 'failed', 'suppressed')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_outbox_provider_enum" AS ENUM('resend', 'nodemailer')`
    );
    await queryRunner.query(
      `CREATE TABLE "email_outbox" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "to" character varying(320) NOT NULL, "cc" character varying(320), "bcc" character varying(320), "from" character varying(320) NOT NULL, "reply_to" character varying(320), "subject" character varying(512) NOT NULL, "template_key" character varying(128), "template_vars" jsonb, "html_body" text, "text_body" text, "channel" "public"."email_outbox_channel_enum" NOT NULL DEFAULT 'transactional', "status" "public"."email_outbox_status_enum" NOT NULL DEFAULT 'queued', "provider_message_id" character varying(256), "provider" "public"."email_outbox_provider_enum" NOT NULL DEFAULT 'resend', "idempotency_key" character varying(128), "attempt" integer NOT NULL DEFAULT '0', "last_error" text, "trace_id" character varying(128), CONSTRAINT "UQ_0916a28c43b791fd0ea78d74718" UNIQUE ("idempotency_key"), CONSTRAINT "PK_b6fbfc201f705fbf1ac87bd7197" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_648db1d4551b4ed132beebbf30" ON "email_outbox" ("to") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e1cafb815a8666793a7d9bd8b" ON "email_outbox" ("template_key") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a131f9addc4fa1eb04bbdc5c3b" ON "email_outbox" ("provider_message_id") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0916a28c43b791fd0ea78d7471" ON "email_outbox" ("idempotency_key") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a98524a9826ee6ba486cb6027" ON "email_outbox" ("trace_id") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."clinic_status_enum" AS ENUM('active', 'inactive', 'draft', 'suspended')`
    );
    await queryRunner.query(
      `CREATE TABLE "clinic" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "org_id" uuid NOT NULL, "display_name" character varying(255) NOT NULL, "legal_name" character varying(255), "slug" character varying(160), "status" "public"."clinic_status_enum" NOT NULL DEFAULT 'active', "phones" jsonb, "emails" jsonb, "website_url" text, "booking_url" text, "social_links" jsonb, "address_line1" character varying(255) NOT NULL, "address_line2" character varying(255), "unit" character varying(50), "city" character varying(120) NOT NULL, "province" character varying(50) NOT NULL, "postal_code" character varying(20) NOT NULL, "country_code" character(2) NOT NULL DEFAULT 'CA', "formatted_address" text, "place_id" character varying(120), "timezone" character varying(60), "lat" numeric(9,6), "lng" numeric(9,6), "location" geography(Point,4326), "open_hours" jsonb, "services" text array NOT NULL DEFAULT '{}', "insurances" text array NOT NULL DEFAULT '{}', "languages" text array NOT NULL DEFAULT '{}', "amenities" jsonb, "wheelchair_accessible" boolean NOT NULL DEFAULT false, "accepts_new_patients" boolean NOT NULL DEFAULT true, "walk_in" boolean NOT NULL DEFAULT false, "telehealth" boolean NOT NULL DEFAULT false, "emergency" boolean NOT NULL DEFAULT false, "avg_wait_minutes" smallint, "specialties" text array NOT NULL DEFAULT '{}', "rating_avg" numeric(3,2) NOT NULL DEFAULT '0', "review_count" integer NOT NULL DEFAULT '0', "logo_url" text, "photo_urls" text array NOT NULL DEFAULT '{}', "short_description" character varying(280), "description" text, "tags" text array NOT NULL DEFAULT '{}', "license_number" character varying(120), "accreditations" text array NOT NULL DEFAULT '{}', "established_year" smallint, "tax_number" character varying(120), "embedding" vector(1536), "data_source" character varying(60) NOT NULL DEFAULT 'manual', "source_updated_at" TIMESTAMP WITH TIME ZONE, "last_synced_at" TIMESTAMP WITH TIME ZONE, "data_version" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_0b620bc70a113b7909eeca1e60f" UNIQUE ("slug"), CONSTRAINT "PK_d7f10e5499997eba0b14b785d58" PRIMARY KEY ("org_id")); COMMENT ON COLUMN "clinic"."rating_avg" IS '0.00 ~ 5.00'`
    );
    await queryRunner.query(`CREATE INDEX "ix_clinic_status" ON "clinic" ("status") `);
    await queryRunner.query(`CREATE INDEX "ix_clinic_postal_code" ON "clinic" ("postal_code") `);
    await queryRunner.query(`CREATE INDEX "ix_clinic_city" ON "clinic" ("city") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "uq_clinic_slug" ON "clinic" ("slug") `);
    await queryRunner.query(
      `CREATE TYPE "public"."invitation_status_enum" AS ENUM('pending', 'accepted', 'revoked', 'expired')`
    );
    await queryRunner.query(
      `CREATE TABLE "invitation" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(255), "updated_by" character varying(255), "deleted_by" character varying(255), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_id" uuid NOT NULL, "target_role_id" uuid NOT NULL, "email" character varying(320) NOT NULL, "status" "public"."invitation_status_enum" NOT NULL DEFAULT 'pending', "inviter_user_id" uuid, "accepted_user_id" uuid, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "token_hash" character varying(255) NOT NULL, "accept_url_base" character varying(512) NOT NULL, "meta" jsonb, "organizationId" uuid NOT NULL, "targetRoleId" uuid NOT NULL, "inviterUserId" uuid NOT NULL, "acceptedUserId" uuid, CONSTRAINT "uq_inv_pending_org_email_role" UNIQUE ("organizationId", "email", "targetRoleId"), CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "ix_inv_accept_url_base" ON "invitation" ("accept_url_base") `
    );
    await queryRunner.query(`CREATE INDEX "ix_inv_token_hash" ON "invitation" ("token_hash") `);
    await queryRunner.query(`CREATE INDEX "ix_inv_expires_at" ON "invitation" ("expires_at") `);
    await queryRunner.query(`CREATE INDEX "ix_inv_status" ON "invitation" ("status") `);
    await queryRunner.query(`CREATE INDEX "ix_inv_email" ON "invitation" ("email") `);
    await queryRunner.query(`CREATE INDEX "ix_inv_org" ON "invitation" ("organizationId") `);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_32a98b1f3966745ebfd18f7955d" FOREIGN KEY ("org_type_id") REFERENCES "organization_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" ADD CONSTRAINT "FK_e7c0659735f8c0d9a77bce95170" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" ADD CONSTRAINT "FK_8d6892f5dba9517b009bab7f764" FOREIGN KEY ("action_id") REFERENCES "action"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_8cb319db6c644b6e59b98bdfd98" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_25ff5fc261ad2318bb4a427dab3" FOREIGN KEY ("organizationTypeId") REFERENCES "organization_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" ADD CONSTRAINT "FK_b7f91d67c393f0811a5849650ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" ADD CONSTRAINT "FK_da27d13f9e8e0baf068a2331f97" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" ADD CONSTRAINT "FK_43a3c5fd03293a390bd5c84931f" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "clinic" ADD CONSTRAINT "FK_d7f10e5499997eba0b14b785d58" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_5c00d7d515395f91bd1fee19f32" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_6deb506a16c06dba549aabdabdc" FOREIGN KEY ("targetRoleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_9f587ec4753f1625058a9eb1c0b" FOREIGN KEY ("inviterUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_c9adb0eb2ac2f96013551dd7dbb" FOREIGN KEY ("acceptedUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_c9adb0eb2ac2f96013551dd7dbb"`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_9f587ec4753f1625058a9eb1c0b"`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_6deb506a16c06dba549aabdabdc"`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_5c00d7d515395f91bd1fee19f32"`
    );
    await queryRunner.query(
      `ALTER TABLE "clinic" DROP CONSTRAINT "FK_d7f10e5499997eba0b14b785d58"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" DROP CONSTRAINT "FK_43a3c5fd03293a390bd5c84931f"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" DROP CONSTRAINT "FK_da27d13f9e8e0baf068a2331f97"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization_role" DROP CONSTRAINT "FK_b7f91d67c393f0811a5849650ea"`
    );
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_25ff5fc261ad2318bb4a427dab3"`);
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3130a39c1e4a740d044e685730"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_8cb319db6c644b6e59b98bdfd98"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" DROP CONSTRAINT "FK_8d6892f5dba9517b009bab7f764"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_action" DROP CONSTRAINT "FK_e7c0659735f8c0d9a77bce95170"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_32a98b1f3966745ebfd18f7955d"`
    );
    await queryRunner.query(`DROP INDEX "public"."ix_inv_org"`);
    await queryRunner.query(`DROP INDEX "public"."ix_inv_email"`);
    await queryRunner.query(`DROP INDEX "public"."ix_inv_status"`);
    await queryRunner.query(`DROP INDEX "public"."ix_inv_expires_at"`);
    await queryRunner.query(`DROP INDEX "public"."ix_inv_token_hash"`);
    await queryRunner.query(`DROP INDEX "public"."ix_inv_accept_url_base"`);
    await queryRunner.query(`DROP TABLE "invitation"`);
    await queryRunner.query(`DROP TYPE "public"."invitation_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."uq_clinic_slug"`);
    await queryRunner.query(`DROP INDEX "public"."ix_clinic_city"`);
    await queryRunner.query(`DROP INDEX "public"."ix_clinic_postal_code"`);
    await queryRunner.query(`DROP INDEX "public"."ix_clinic_status"`);
    await queryRunner.query(`DROP TABLE "clinic"`);
    await queryRunner.query(`DROP TYPE "public"."clinic_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6a98524a9826ee6ba486cb6027"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0916a28c43b791fd0ea78d7471"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a131f9addc4fa1eb04bbdc5c3b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3e1cafb815a8666793a7d9bd8b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648db1d4551b4ed132beebbf30"`);
    await queryRunner.query(`DROP TABLE "email_outbox"`);
    await queryRunner.query(`DROP TYPE "public"."email_outbox_provider_enum"`);
    await queryRunner.query(`DROP TYPE "public"."email_outbox_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."email_outbox_channel_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6463cd0c29ed19c57b895d8c2d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8b37f8d324287f49ffb44550a2"`);
    await queryRunner.query(`DROP TABLE "email_receipt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c799e37d31dc4930aa36f7d483"`);
    await queryRunner.query(`DROP TABLE "email_suppression"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_uor_name"`);
    await queryRunner.query(`DROP INDEX "public"."ix_uor_user"`);
    await queryRunner.query(`DROP INDEX "public"."ix_uor_org"`);
    await queryRunner.query(`DROP INDEX "public"."ix_uor_role"`);
    await queryRunner.query(`DROP TABLE "user_organization_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3551ef7cbf25d2e49b1665bc55"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ee999bb389d7ac0fd967172c41"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_role_source_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_401d840f6b1957fa74ac631c61"`);
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_240853a0c3353c25fb12434ad3"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "permission_action"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4aa35beeebe7073b51be93aae6"`);
    await queryRunner.query(`DROP TABLE "action"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c8ed18ff47475e2c4a7bf59daa"`);
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d34106f8ec1ebaf66f4f8609dd"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_honorific_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "organization_type"`);
  }
}
