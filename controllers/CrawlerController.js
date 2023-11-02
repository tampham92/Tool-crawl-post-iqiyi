const puppeteer = require('puppeteer');
const IqiyiPost = require('../models/IqiyiPostModel');

require("dotenv").config();

class CrawlerController {
    /**
     * Crawl detail page
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async crawlDetailPage(req, res, next) {
        // Launch the browser in production
        var browser = '';
        if (process.env.NODE_DEV === 'PROD') {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox', 'single-process', '--no-zygote'],
                executablePath: process.env.NODE_ENV === 'production'
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
            });
        }

        // Launch the browser in dev
        if (process.env.NODE_DEV === 'DEV') {
            browser = await puppeteer.launch({
                userDataDir: './tmp',
                headless: true
            });
        }

        // Navigate the page to a URL
        const page = await browser.newPage();
        await page.goto('https://ssports.iqiyi.com/news/67561020', {
            waitUntil: 'domcontentloaded', // Waiting write content
        });

        try {
            const elementTitle = await page.waitForSelector('.style_newsTitle_hc4');
            const title = await elementTitle.evaluate(el => el.textContent);

            const elementContent = await page.waitForSelector('.style_newsContent_1ph');
            const content = await elementContent.evaluate(el => el.textContent)

            const images = await page.$$('p > a') // Get multiple element in tagname
            const listImage = [];
            for (const image of images) {
                const image_url = await page.evaluate(el => el.querySelector("img").getAttribute("src"), image);
                listImage.push(image_url);
            }

            var postItem = {
                "title": title,
                "content": content,
                "image": listImage,
            }
        } catch (error) {
            console.log(error);
        }

        await browser.close();
        res.json(postItem);
    }

    /**
     * Clawler 12 post on top page
     */
    async crawlMultiplePost(req, res, next) {
        // Launch the browser in production
        var browser = '';
        if (process.env.NODE_DEV === 'PROD') {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox', 'single-process', '--no-zygote'],
                executablePath: process.env.NODE_ENV === 'production'
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
            });
        }

        // Launch the browser in dev
        if (process.env.NODE_DEV === 'DEV') {
            browser = await puppeteer.launch({
                userDataDir: './tmp',
                headless: true
            });
        }

        // Navigate the page to a URL
        const page = await browser.newPage();
        await page.goto('https://ssports.iqiyi.com', {
            waitUntil: 'domcontentloaded', // Waiting write content
            timeout: 0
        });

        // Get list elements
        await page.waitForSelector('.style_list_2F4', { visible: true, timeout: 0 });
        const posts = await page.$$('.style_list_2F4');

        // Get url post in firt page and push to array list
        const listUrl = [];
        for (const post of posts) {
            try {
                const [url] = await Promise.all([
                    new Promise((resolve) => {
                        browser.once('targetcreated', (target) => { resolve(target.url()); });
                    }),
                    post.click(),
                ]);

                listUrl.push(url);

            } catch (error) {
                console.log(error);
            }
        }

        let listPost = [];
        // Navigate the page detail by url and get content + image_url + title
        for (let i = 0; i < listUrl.length; i++) {
            try {
                const url = listUrl[i];
                await page.goto(`${url}`, {
                    waitUntil: 'domcontentloaded',
                    timeout: 0
                });

                // Title of post
                const elementTitle = await page.waitForSelector('.style_newsTitle_hc4', { timeout: 5000 });
                const title = await elementTitle.evaluate(el => el.textContent);

                // Content of post
                await page.waitForSelector('.style_newsContent_1ph', { timeout: 5000 });
                const contents = await page.$('.style_newsContent_1ph');
                const contentArray = await contents.$$eval('p', (nodes) => nodes.map(node => {
                    return node.innerHTML
                }))

                // const images = await page.$$('p > a') // Get multiple element in tagname
                // Lấy danh sách images
                // const listImage = [];
                // for (const image of images){
                //     const image_url = await page.evaluate(el => el.querySelector("img").getAttribute("src"), image);
                //     listImage.push(image_url);
                // }

                const postItem = {
                    "title": title,
                    "content": contentArray,
                    "post_url": url,
                }

                // listPost.push(postItem);
                // save to db if title is not exist
                const postExist = await IqiyiPost.findOne({ where: { title: title } });
                if (postExist === null) {
                    await IqiyiPost.create(postItem);
                }

            } catch (error) {
                console.log(error);
            }
        }

        await browser.close();

        res.json({
            status: true,
            data: "ok"
        });
    }
}



module.exports = new CrawlerController;