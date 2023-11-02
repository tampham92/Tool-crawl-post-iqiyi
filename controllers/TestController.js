const { json } = require('sequelize');
const IqiyiPost = require('../models/IqiyiPostModel');

class TestController {
    async hello (req, res, next){
        const posts = await IqiyiPost.findAll({raw:true})
        res.send(json(posts));
    }
}

module.exports = new TestController;