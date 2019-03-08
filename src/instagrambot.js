const puppeteer = require("puppeteer");

const BASE_URL = "https://instagram.com";
const USER_URL = user => `https://www.instagram.com/${user}`;
const instagrambot = {
    browser: null,
    page: null,
    init: async () => {
        instagrambot.browser = await puppeteer.launch({
            headless: false
        });

        instagrambot.page = await instagrambot.browser.newPage();
    },

    login: async (username, password) => {
        await instagrambot.page.goto(BASE_URL, {
            waitUntil: "networkidle2"
        });

        await instagrambot.page.waitFor(5000);

        let loginButton = await instagrambot.page.$x(
            '//a[contains(text(), "Log in")]'
        );

        await loginButton[0].click();

        // await instagrambot.page.waitForNavigation({
        //     waitUntil: 'networkidle2'
        // });

        await instagrambot.page.waitFor(1000);

        await instagrambot.page.type('input[name="username"]', username, {
            delay: 50
        });
        await instagrambot.page.type('input[name="password"]', password, {
            delay: 50
        });

        loginButton = await instagrambot.page.$x(
            '//button[div[contains(text(), "Log in")]]'
        );

        await loginButton[0].click();

        await instagrambot.page.waitForNavigation({
            waitUntil: 'networkidle2'
        });

        let notificationsNotNowButton = await instagrambot.page.$x(
            '//button[contains(text(), "Not Now")]'
        );

        if (notificationsNotNowButton.length == 1) {
            console.log("Found Not Now!");
            await notificationsNotNowButton[0].click();
        }
    },

    likePictures: async (users = []) => {
        for (let user of users) {
            await instagrambot.page.goto(USER_URL(user), {
                waitUntil: 'networkidle2'
            });
            await instagrambot.page.waitFor(1000);
            let posts = await instagrambot.page.$$('article > div:nth-child(1) > div:nth-child(1) img[decoding="auto"]')
            for (let post of posts) {
                await post.click();
                //Wait for the image to appear
                await instagrambot.page.waitFor('span[id="react-root"][aria-hidden="true"]');
                await instagrambot.page.waitFor(1000);

                let canBeLiked = await instagrambot.page.$('span[aria-label="Like"]')

                if (canBeLiked) {
                    await instagrambot.page.click('span[aria-label="Like"]');
                }
                await instagrambot.page.waitFor(1000);
                //Close the image
                let closeButton = await instagrambot.page.$x('//button[contains(text(), "Close")]')
                await closeButton[0].click();
                await instagrambot.page.waitFor(500);
            }
            await instagrambot.page.waitFor(15000);
        }

    }
};

module.exports = instagrambot;