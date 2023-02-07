exports.up = function (knex) {
    return knex.schema.alterTable('parts', t => {
        t.string('oem');
    });

};

exports.down = function (knex) {
    return knex.schema.alterTable("parts", t => {
        t.dropColumn('oem')
    });
};
