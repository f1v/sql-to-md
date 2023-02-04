import { groupBy } from '../helpers/groupBy.js';
import { exec } from './connection.js';

export const parseTableIndexes = async (db, table) => {
  const [indexes] = await exec(
    `
    SELECT DISTINCT
        INDEX_NAME,
        COLUMN_NAME,
        SEQ_IN_INDEX,
        NULLABLE
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = ?
    AND TABLE_NAME = ?
     `,
    [db, table],
  );

  return groupBy(indexes, 'INDEX_NAME');
};
