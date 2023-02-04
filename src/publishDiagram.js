import fs from 'fs';
import path from 'path';

const directory = 'docs/diagrams';

const publishDiagram = (dbs) => {
  // publish mermaid diagram of db

  fs.rmSync(path.join(directory), { recursive: true, force: true }, (err) => {
    if (err) throw `Error deleting directory: ${err}`;
    console.log('Deleted directory: ' + directory);
  });

  fs.mkdirSync(directory, (err) => {
    if (err) throw `Error making directory: ${err}`;
    console.log('Created directory: ' + directory);
  });

  let sidebarOutput = `# Diagrams\n`;
  dbs.forEach((db) => {
    let diagram = '```mermaid\nerDiagram';

    db.tables.forEach((table) => {
      table.relationships.references.forEach((relatedTable) => {
        if (relatedTable.CONSTRAINT_NAME === 'PRIMARY') {
          return;
        }
        console.log(relatedTable);
        diagram += `\n\t${table.name} ||--|| ${relatedTable.REFERENCED_TABLE_NAME} : ${relatedTable.TABLE_NAME}-${relatedTable.COLUMN_NAME} `;
      });

      diagram += `\n\t${table.name} {`;
      table.columns.map(
        (column) => (diagram += `\n\t\tstring ${column.COLUMN_NAME}`),
      );
      diagram += `\n\t}`;
    });

    diagram += '\n```';

    fs.writeFileSync(path.join(directory, `${db.database}.md`), diagram);
    sidebarOutput += `- [${db.database}](diagrams/${db.database}.md)\n`;
  });
  fs.writeFileSync(path.join(directory, `Readme.md`), sidebarOutput);
};
export default publishDiagram;
