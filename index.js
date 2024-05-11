const AWS = require('aws-sdk');
const s3 = new AWS.S3();

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

module.exports.postHandlerTwo = async (event) => {
    console.log('POST method');
    console.log(event);

    const {v4: uuidv4} = require('uuid');

    // Extract the body from the event
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('Failed to parse JSON: ', error);
        return {
            statusCode: 200,
            body: JSON.stringify(null),
        };
    }

    // Create a new S3 bucket
    const baseName = 'albertbucket';
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