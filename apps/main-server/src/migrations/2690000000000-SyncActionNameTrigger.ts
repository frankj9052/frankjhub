import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncActionNameTrigger implements MigrationInterface {
  name = 'SyncActionNameTrigger2690000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) 触发器函数：当 action.name 变化，批量更新依赖表中的冗余 action_name
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION sync_action_name_on_update()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      BEGIN
        IF NEW.name IS DISTINCT FROM OLD.name THEN
          -- 按需列出所有含有 action_id / action_name 的表
          UPDATE permission
             SET action_name = NEW.name
           WHERE action_id = NEW.id;

          UPDATE scope
             SET action_name = NEW.name
           WHERE action_id = NEW.id;
        END IF;
        RETURN NEW;
      END;
      $$;
    `);

    // 2) 在 action 表上挂 AFTER UPDATE OF name 触发器
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_action_rename ON action;
      CREATE TRIGGER trg_action_rename
      AFTER UPDATE OF name ON action
      FOR EACH ROW
      EXECUTE FUNCTION sync_action_name_on_update();
    `);

    // 3) 性能保障（一般外键会隐含/自带索引，但如果你没建，这里确保有）
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS ix_permission_action_id ON permission (action_id);`
    );
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS ix_scope_action_id ON scope (action_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_action_rename ON action;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS sync_action_name_on_update;`);
    // 索引可按需保留，一般不删
  }
}
