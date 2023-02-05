#!/usr/bin/env node
const { run } = require('../lib/sql2md.js');

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
