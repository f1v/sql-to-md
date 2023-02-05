import publishDiagram from './publishDiagram.js';
import publishMarkdown from './publishMarkdown.js';
import { parseDatabase } from './parseDatabase.js';

(async () => {
  const dbs = await parseDatabase();
  publishMarkdown(dbs);
  publishDiagram(dbs);
})();
