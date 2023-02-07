const bookshelf = require('../config/bookshelf');

const Server = bookshelf.Model.extend({
    tableName: "servers",
    hasTimestamps: true,
    autoIncrememnt: true
});

module.exports = bookshelf.model("Server",Server);