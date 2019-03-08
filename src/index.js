const ig = require('./instagrambot');

(async () => {
    await ig.init();
    //enter credentials here
    await ig.login("username", "pwd");
    //enter usernames
    await ig.likePictures(['sixstreetunder']);
    debugger;
})()