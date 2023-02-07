
exports.up = function(knex) {
  return knex.schema.table('parts', function (t) {
      t.string('product_id');
  })
};

exports.down = function(knex) {
  return knex.schema.table('parts', function (t) {
      t.dropColumn('product_id');
  })
};
