import { exec, execWithLog } from './connection.js';

export const parseTableColumns = async (db, table) => {
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

  const [referencedBy] = await exec(
    `SELECT
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
    FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
        REFERENCED_TABLE_SCHEMA = ?
        AND REFERENCED_TABLE_NAME = ?
        AND REFERENCED_COLUMN_NAME in (?)`,
    [db, table, columns.map((column) => column.COLUMN_NAME)],
  );

  const [references] = await exec(
    `SELECT
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
    FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
        TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME in (?)`,
    [db, table, columns.map((column) => column.COLUMN_NAME)],
  );

  columns.map((column) => {
    const foreignKey = references.find(
      (reference) => reference.COLUMN_NAME === column.COLUMN_NAME,
    );
    const relatedBy = referencedBy.find(
      (reference) => reference.REFERENCED_COLUMN_NAME === column.COLUMN_NAME,
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
  });

  return columns;
};
