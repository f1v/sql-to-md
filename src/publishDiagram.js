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

  dbs.forEach((db) => {
    let diagram = '```mermaid\nerDiagram';

    db.tables.forEach((table) => {
      table.relationships.references.forEach((relatedTable) => {
        diagram += `\n\t${table.name} ||--|| ${relatedTable.REFERENCED_TABLE_NAME} : ${relatedTable.COLUMN_NAME} `;
      });
      
      diagram += `\n\t${table.name} {`;
      table.columns.map(
        (column) => (diagram += `\n\t\tstring ${column.COLUMN_NAME}`),
      );
      diagram += `\n\t}`;
    });

    diagram += '\n```';

    fs.writeFileSync(path.join(directory, 'README.md'), diagram);
  });
};
export default publishDiagram;
