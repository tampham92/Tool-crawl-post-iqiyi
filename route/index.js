
const express = require('express');
const router = express.Router();
const crawler = require('../controllers/CrawlerController');
const test = require('../controllers/TestController');

router.get('/', test.hello);

router.get('/crawler/multiplePost', crawler.crawlMultiplePost);
router.get('/crawler/detailPage', crawler.crawlDetailPage);

module.exports = router;