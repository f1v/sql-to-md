import mysql from 'mysql2/promise';
import { groupBy } from './helpers/groupBy.js';
import publishMarkdown from './publishMarkdown.js';

const IGNORE_DATABASES = [
  'information_schema',
  'mysql',
  'performance_schema',
  'sys',
];

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '33062',
  });

  const exec = async (...args) => await connection.execute(...args);

  const [dbs] = await exec('SHOW DATABASES');
  const userDbs = dbs
    .filter((db) => !IGNORE_DATABASES.find((name) => db['Database'] === name))
    .map((db) => db['Database']);

  const dbSchemas = await Promise.all(
    userDbs.map(async (db) => {
      const tables = (await exec(`SHOW TABLES FROM ${db}`))[0].map(
        (table) => table[`Tables_in_${db}`],
      );
      return {
        db,
        tables: await Promise.all(
          tables.map(async (table) => {
            const [relationships] = await exec(
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

            const [columns] = await exec(
              `
            SELECT 
                COLUMN_NAME,    
                column_comment,
                data_type,
                is_nullable,
                column_default,
                column_key,
                extra,
                SUBSTRING(COLUMN_TYPE, 6, LENGTH(COLUMN_TYPE) - 6) AS ENUM_VALUES
            FROM information_schema.columns
            WHERE table_schema = '${db}' AND table_name = '${table}'`,
              [db, table],
            );

            return {
              table,
              constraints: groupBy(constraints, 'CONSTRAINT_NAME'),
              columns: columns.map((column) => {
                const foreignKey = relationships.filter(
                  (relationship) =>
                    relationship.COLUMN_NAME === column.COLUMN_NAME,
                );
                const relatedBy = relationships.filter(
                  (relationship) =>
                    relationship.REFERENCED_COLUMN_NAME === column.COLUMN_NAME,
                );
                if (column.DATA_TYPE !== 'enum') {
                  delete column.ENUM_VALUES;
                }
                if (foreignKey) {
                  column.RELATES_TO = foreignKey;
                }
                if (relatedBy) {
                  column.RELATED_BY = relatedBy;
                }

                return column;
              }),
            };
          }),
        ),
      };
    }),
  );

  publishMarkdown(dbSchemas[0]);
})();
