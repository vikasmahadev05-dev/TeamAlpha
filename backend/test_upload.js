const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

async function testUpload() {
    try {
        const formData = new FormData();
        // create a dummy file
        fs.writeFileSync('dummy.jpg', 'dummy content');
        formData.append('image', fs.createReadStream('dummy.jpg'));

        // Assume login token or something is needed, wait the endpoint requires auth!
        // The error might be from auth middleware.
        console.log("We need auth token for the API. We can't easily test without it.");
    } catch (e) {
        console.error(e);
    }
}
testUpload();
