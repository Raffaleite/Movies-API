exports.up = knex => knex.schema.createTable("movie_notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("rating");
    table.integer("user_id").references("id").inTable("users"); // faz que o user_id seja o mesmo id da tabela users
  
    table.timestamp("created_at").default(knex.fn.now()); // pega o dia e hora atual
    table.timestamp("updated_at").default(knex.fn.now());
  });
  
  exports.down = knex => knex.schema.dropTable("movie_notes");