import fs from 'fs';
import nodePlop from 'node-plop';
import path from 'path';
import buildClassDiagram from './helpers/buildClassDiagram.js';
import buildSidebar from './helpers/buildSidebar.js';
import tableConfig from './tableConfig.js';

const plop = await nodePlop(`./plopfile.js`);

const directory = 'docs/generated';

export default async (databases) => {
  // get a generator by name
  const basicAdd = plop.getGenerator('table');
  const modifySidebar = plop.getGenerator('sidebar');

  try {
    fs.rmSync(path.join(directory), { recursive: true, force: true });
    fs.mkdirSync(directory);
    fs.writeFileSync(path.join(directory, 'README.md'), 'hi');
  } catch (e) {
    throw new Error(e);
  }

  // write to file
  await Promise.all(
    databases.map(async (db) => {
      db.tables.map(async (table) => {
        const tableMeta = tableConfig[table.name];
        const { failures } = await basicAdd.runActions({
          database: db.database,
          description: table.TABLE_COMMENT,
          classDiagram: buildClassDiagram(table),
          columns: table.columns,
          name: table.name,
          references: table.relationships.references,
          title: table.name.replace(/_/g, ' '),
          ...(tableMeta || {}),
        });
        if (failures.length > 0) {
          failures.forEach((failure) => {
            console.error(failure.error);
          });
        }
      });
    }),
  );

  // TODO: append synchronosly to sidebar?

  const { failures2 } = await modifySidebar.runActions({
    list: buildSidebar(databases),
  });
  if (failures2 && failures2.length > 0) {
    failures2.forEach((failure) => {
      console.error(failure.error);
    });
  }
  // console.log(input.tables[0]);
  console.log('Success!', databases.length, 'files generated');
};
