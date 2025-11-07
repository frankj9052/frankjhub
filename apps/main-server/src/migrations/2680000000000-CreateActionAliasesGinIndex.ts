import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActionAliasesGinIndex implements MigrationInterface {
  name = 'CreateActionAliasesGinIndex2680000000000';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 确保 pg_trgm 扩展存在
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // 无需建立 GIN trigram 索引，这种模糊搜索需要text而不是array
    // array我们只需要原生GIN
    await queryRunner.query(`
      CREATE INDEX idx_action_aliases_gin
      ON "action"
      USING gin ("aliases");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_action_aliases_gin;`);
  }
}
