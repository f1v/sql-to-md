import { exec } from './connection.js';

const TABLE_COLUMN_NAME = 'Tables_in_';

export const extractTables = async (db) => {
  const [tables] = await exec(`SHOW TABLES FROM ${db}`);

  return tables.map((table) => table[`${TABLE_COLUMN_NAME}${db}`]);
};
