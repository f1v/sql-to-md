import mysql from 'mysql2/promise';

const IGNORE_DATABASES = ['information_schema', 'mysql', 'performance_schema', 'sys'];

(async () => {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        port: "33062",
    });

    const [dbs] = await connection.execute('SHOW DATABASES');
    const userDbs = dbs.filter(db => !IGNORE_DATABASES.find((name) => db['Database'] === name))


    console.log("Rows:", userDbs)
})()