export default (dbList) => {
  let sidebarOutput = `- [Home](/)
- [Databases](/generated/README.md)`;
  dbList.map(async (db) => {
    sidebarOutput = `${sidebarOutput}
  - ${db.database}`;
    db.tables.forEach(
      (table) =>
        (sidebarOutput = `${sidebarOutput}
    - [${table.name}](/generated/${db.database}/${table.name}.md)`),
    );
  });

  return sidebarOutput;
};
