
exports.up = function(knex) {
    return knex.schema.createTable('parts', t => {
        t.increments();  
        t.string('part_number');
        t.string('type');       
        t.text('url');
        t.jsonb('specification');
        t.string('server_description');
        t.text('part_description');
        t.string('country');
        t.string('category');
        t.string('sub_category');
        t.string('product_type');
        t.string('RoHS');       
        t.string('store_name');        
        t.text('breadcrumbs');      
        t.text('image');   
        t.enu('active_status',['active','inactive','deleted','hidden'],{ useNative: false}).defaultTo('active');
        t.timestamps();    
        t.index(['part_number'], 'index_parts_on_part_number')   
    }); 
};

exports.down = function(knex) {
    return knex.schema.dropTable('parts');
};
