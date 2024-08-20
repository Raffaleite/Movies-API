exports.up = knex => knex.schema.createTable("movie_tags", table => {
    table.increments("id");
    table.text("name").notNullable();
  
    table.integer("note_id").references("id").inTable("movie_notes").onDelete("CASCADE"); // quando uma nota é deletada, ou seja seu note_id é deletado faz com que a tags tambem seja deletada
    table.integer("user_id").references("id").inTable("users");
  });
  
  exports.down = knex => knex.schema.dropTable("movie_tags");