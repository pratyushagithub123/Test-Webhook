const bookshelf = require('../config/bookshelf');

const ServerPart = bookshelf.Model.extend({
    tableName: "server_parts_compatibilities",
    hasTimestamps: true,
    autoIncrememnt: true,
    server: function() {
        return this.belongsTo('Server');
    },
    part: function () {
        return this.belongsTo("Part");
    },
});

module.exports = bookshelf.model("ServerPart",ServerPart);