const { DataTypes } = require('sequelize');
const IqiyiPost = require('./IqiyiPostModel');

const database = require('../config/database');

const IqiyiImage = database.define('dp_iqiyi_images', {
    id : {
        type: DataTypes.BIGINT,
        autoIncrementIdentity: true,
        primaryKey: true,
    },
    post_id: DataTypes.BIGINT,
    image_base64: DataTypes.TEXT,
    image_url: DataTypes.TEXT,
}, {
    tableName: 'dp_iqiyi_images'
});

database.sync();

module.exports = IqiyiImage;