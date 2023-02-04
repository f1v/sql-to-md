import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  port: '33062',
});

export const exec = async (...args) => await connection.query(...args);

export const execWithLog = async (...args) => {
  console.log(mysql.format(args[0], args[1]));
  return await exec.apply(this, args);
};
