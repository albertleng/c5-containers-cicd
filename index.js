const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, world!!');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = server;

if (process.env.GITHUB_ACTIONS) {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });
}

module.exports.handlerTwo = async (event) => {
    console.log('GET method');
    console.log(event);
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Hahaha!",
                input: event,
            },
            null,
            2
        ),
    };
};

function isJSONParsable(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports.postHandlerTwo = async (event) => {
    console.log('POST method');
    console.log(event);

    const {v4: uuidv4} = require('uuid');

    // Extract the body from the event
    let body;
    try {
        // add a check for event.body. If event.body is not parsable by JSON, body = event.body, else parse it
        let eventBody = event.body;
        if (isJSONParsable(eventBody)) {
            body = JSON.parse(eventBody);
        } else {
            body = null;
        }
    } catch (error) {
        console.error('Failed to parse JSON: ', error);
        return {
            statusCode: 200,
            body: JSON.stringify(null),
        };
    }

    // Create a new S3 bucket
    const baseName = 'albertbuck';
    const uuid = uuidv4().toLowerCase().replace(/_/g, '1');
    const bucketName = baseName + uuid.substring(0, 63 - baseName.length);
    const bucketParams = {
        Bucket: bucketName,
    };

    try {
        const data = await s3.createBucket(bucketParams).promise();
        console.log('Bucket created successfully', data.Location);
    } catch (error) {
        console.error('Failed to create bucket: ', error, 'Bucket Parameters: ', bucketParams);
        return {
            statusCode: 200,
            body: JSON.stringify({error: "Failed to create bucket"}, null, 2),
        };

    }

    // Do something with the body
    // For now, just return it in the response
    return {
        statusCode: 200,
        body: JSON.stringify(body, null, 2),
    };
};