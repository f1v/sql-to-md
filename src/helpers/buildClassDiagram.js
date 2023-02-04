export default (table) => {
  const tables = {};
  table.relationships.references.forEach((r) => {
    if (r.REFERENCED_TABLE_NAME) tables[r.REFERENCED_TABLE_NAME] = r;
  });

  return `
  !theme minty
  entity ${table.name} {
${Object.keys(tables)
  .map((name) => `  ${tables[name].COLUMN_NAME}`)
  .join('\n')}
    }
${Object.keys(tables)
  .map((name) => `  entity ${name}`)
  .join('\n')}

${Object.keys(tables)
  .map((name) => `  ${table.name}::${tables[name].COLUMN_NAME} ..> ${name}`)
  .join('\n')}
    `;
};
