const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({
        userDataDir: '../tmp'
    });
    const page = await browser.newPage();
  
    // Navigate the page to a URL
    await page.goto('https://ssports.iqiyi.com', {
        waitUntil: 'domcontentloaded', // Waiting write content
        timeout: 0 
    });

    // Get list elements
    await page.waitForSelector('.style_list_2F4' , {  visible: true , timeout: 0 });
    const posts = await page.$$('.style_list_2F4');

    // get url post in firt page and push to array list
    const listUrl = [];
    for(const post of posts){
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

    // Navigate the page detail by url and get content + image_url + title
    const listPost = [];
    for (let i = 0; i <= listUrl.length; i++){
        // await page.waitForNavigation({ 
        //     waitUntil: 'networkidle2', 
        // });
        try {
            const url = listUrl[i];   
              
            await page.goto(`${url}`, {
                waitUntil: 'domcontentloaded',
                timeout: 0
            });

            console.log(url);
            
            const elementTitle =  await page.waitForSelector('.style_newsTitle_hc4');
            const title = await elementTitle.evaluate(el => el.textContent);

            const elementContent =  await page.waitForSelector('.style_newsContent_1ph');
            const content =  await  elementContent.evaluate(el => el.textContent)

            const elementImage =  await page.waitForSelector('p > a');
            const image =  await  elementImage.evaluate(el => el.getAttribute('href'))

            const postItem = {
                "title": title,
                "content": content,
                "image_url": image
            }
            
            listPost.push(postItem);

            console.log(title);
            console.log(content);
            console.log(image);
        } catch (error) {
            console.log(error);
        }
    }    
    
    // await browser.close();
})();
