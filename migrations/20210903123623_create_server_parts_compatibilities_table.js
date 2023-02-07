
exports.up = function(knex) {
    return knex.schema.createTable('server_parts_compatibilities', t => {
        t.increments();        
        t.integer('server_id').references('id').inTable('servers');   
        t.integer('part_id').references('id').inTable('parts');  
        t.timestamps();  
        t.index(['part_id', 'server_id'], 'index_on_part_id_and_server_id');
   });
};

exports.down = function(knex) {
    return knex.schema.dropTable('server_parts_compatibilities');
};
