'use strict';
module.exports = async (req, res) => {
    try { 
        return res.success();
    } catch (error) {
        return res.serverError(500);
    }
};