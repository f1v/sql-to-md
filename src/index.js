import publishMarkdown from './publishMarkdown.js';

import { parseDatabase } from './parseDatabase.js';

(async () => {
  const dbs = await parseDatabase();
  console.log(dbs);
  publishMarkdown(dbs[0]);
})();
