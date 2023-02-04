import { groupBy } from '../helpers/groupBy.js';
import { exec } from './connection.js';

export const parseTableConstraints = async (db, table) => {
  const [constraints] = await exec(
    `
    SELECT
        a.COLUMN_NAME as COLUMN_NAME,
        a.CONSTRAINT_NAME as CONSTRAINT_NAME,
        a.REFERENCED_COLUMN_NAME as REFERENCED_COLUMN_NAME,
        a.REFERENCED_TABLE_NAME as REFERENCED_TABLE_NAME,
        b.DELETE_RULE as DELETE_RULE,
        b.UPDATE_RULE as UPDATE_RULE
    FROM information_schema.KEY_COLUMN_USAGE a
    JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS b USING (CONSTRAINT_NAME)

    WHERE
        a.REFERENCED_TABLE_SCHEMA = ?
        AND a.TABLE_NAME = ?
     `,
    [db, table],
  );

  return groupBy(constraints, 'CONSTRAINT_NAME');
};
