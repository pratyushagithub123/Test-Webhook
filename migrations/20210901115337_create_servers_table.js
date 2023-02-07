
exports.up = function(knex) {
  
    return knex.schema.createTable('servers', t => {
        t.increments();    
        t.unique(['server_description','store_name'])    
        t.string('name');        
        t.string('sku');
        t.string('server_description');
        t.string('page_title');
        t.text('breadcrumbs');
        t.text('url');
        t.text('image');
        t.text('motherboard');
        t.jsonb('specification');        
        t.string('store_name');
        t.string('series');
        t.string('A'),
        t.string('B'),
        t.string('C'),
        t.jsonb('formatted_specs'),
        t.enu('active_status',['active','inactive','deleted','hidden'],{ useNative: false}).defaultTo('active');
        t.timestamps();
        t.index (['server_description'], 'index_servers_on_server_description');
   });
};

exports.down = function(knex) {
    return knex.schema.dropTable('servers');
};
