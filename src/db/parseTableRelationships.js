import { exec } from './connection.js';

export const parseTableRelationships = async (db, table) => {
  const [referencedBy] = await exec(
    `
            SELECT
                TABLE_NAME,
                COLUMN_NAME,
                CONSTRAINT_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE
                REFERENCED_TABLE_SCHEMA = ?
                AND REFERENCED_TABLE_NAME = ?`,
    [db, table],
  );
  const [references] = await exec(
    `
            SELECT
                TABLE_NAME,
                COLUMN_NAME,
                CONSTRAINT_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE
                TABLE_SCHEMA = ?
                AND TABLE_NAME = ?`,
    [db, table],
  );

  return {
    referencedBy,
    references,
  };
};
