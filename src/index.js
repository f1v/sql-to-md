import publishDiagram from './publishDiagram.js';
import publishMarkdown from './publishMarkdown.js';
import { parseDatabase } from './parseDatabase.js';

(async () => {
  const dbs = await parseDatabase();
  console.log(dbs[0].tables);
  publishMarkdown(dbs);
  publishDiagram(dbs);
})();
