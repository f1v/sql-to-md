import { exec } from './connection.js';

const IGNORE_DATABASES = [
  'information_schema',
  'mysql',
  'performance_schema',
  'sys',
];
const DB_COLUMN_NAME = 'Database';

export const extractDatabases = async () => {
  const [dbs] = await exec('SHOW DATABASES');
  return dbs
    .filter(
      (db) => !IGNORE_DATABASES.find((name) => db[DB_COLUMN_NAME] === name),
    )
    .map((db) => db[DB_COLUMN_NAME]);
};
