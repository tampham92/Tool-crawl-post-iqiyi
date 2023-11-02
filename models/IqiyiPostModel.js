const { DataTypes } = require('sequelize');
const images = require('./IqiyiImageModel');
const database = require('../config/database');

const IqiyiPost = database.define('dp_iqiyi_posts', {
    id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrementIdentity: true,
    },
    title: DataTypes.STRING,
    content: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue("content"));
        },
        set: function (value) {
            return this.setDataValue("content", JSON.stringify(value));
        }
    },
    images_url: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue("images_url"));
        },
        set: function (value) {
            return this.setDataValue("images_url", JSON.stringify(value));
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
    },
    post_url: {
        type: DataTypes.STRING,
        field: "post_url"
    },
}, {
    tableName: 'dp_iqiyi_posts'
});

// 1 bai post co nhieu hinh
// IqiyiPost.hasMany(images, {
//     foreignKey: 'post_id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// })

database.sync({ alter: true });

module.exports = IqiyiPost;