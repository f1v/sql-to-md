import { extractDatabases } from './db/extractDatabases.js';
import { extractTables } from './db/extractTables.js';
import { parseTable } from './db/parseTable.js';

export const parseDatabase = async () => {
  const databases = await extractDatabases();

  return await Promise.all(
    databases.map(async (db) => {
      const tables = await extractTables(db);

      return {
        database: db,
        tables: await Promise.all(
          tables.map(async (table) => parseTable(db, table)),
        ),
      };
    }),
  );
};
