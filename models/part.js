const bookshelf = require('../config/bookshelf');

const Part = bookshelf.Model.extend({
    tableName: "parts",
    hasTimestamps: true,
    autoIncrememnt: true
});

module.exports = bookshelf.model("Part",Part);