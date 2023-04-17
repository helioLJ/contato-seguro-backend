exports.up = knex => knex.schema.createTable("register", table => {
  table.increments("id");

  table.integer('user_id').unsigned().references('id').inTable('users').onDelete("CASCADE").notNullable();
  table.integer('company_id').unsigned().references('id').inTable('companies').onDelete("CASCADE").notNullable();

  table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("register");
