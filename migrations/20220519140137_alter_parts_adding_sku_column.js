exports.up = function (knex) {
    return knex.schema.table('parts', function (t) {
        t.string('sku');
    })
};

exports.down = function (knex) {
    return knex.schema.table('parts', function (t) {
        t.dropColumn('sku');
    })
};
