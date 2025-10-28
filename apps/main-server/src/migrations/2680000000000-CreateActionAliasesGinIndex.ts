import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActionAliasesGinIndex2680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 确保 pg_trgm 扩展存在
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // 建立 GIN trigram 索引
    await queryRunner.query(`
      CREATE INDEX idx_action_aliases_gin
      ON "action"
      USING gin ("aliases" gin_trgm_ops);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_action_aliases_gin;`);
  }
}
