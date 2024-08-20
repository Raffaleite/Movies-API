const sqliteConnection = require('../../sqlite');
const createUsers = require('./createUsers')

async function migrationsRun(){
    const schemas = [ // cria o esquema de como criar as tabelas, como sao muitas tabelas é um vetor // o join é para juntar todas as migrations
        createUsers
    ].join('')

    sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error));
}

module.exports = migrationsRun;