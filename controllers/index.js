const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: '../tmp'
    });
    const page = await browser.newPage();
  
    // Navigate the page to a URL
    await page.goto('https://ssports.iqiyi.com', {
        waitUntil: 'load', // Waiting write content
        timeout: 0 
    });

    // await page.waitForSelector('.style_list_2F4' , {  visible: true , timeout: 0 });
    const posts = await page.$$('.style_list_2F4');

    const listPost = [];
    for (const post of posts){

        const title = await page.evaluate(el => el.querySelector(".style_text_33o").textContent, post);
        const image = await page.evaluate(el => el.querySelector("img").getAttribute("src"), post);

        const postItem = {
            "title": title,
            "image": image
        }
        
        listPost.push(postItem);
    }
        
    console.log(listPost);


    // await page.screenshot({path: "ssports.png"})
    // const html = await page.content();

    // fs.writeFileSync('ssportivi.html', html);
    // console.log("ok");
  
  
    // await browser.close();
  })();