const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const {handlerTwo, postHandlerTwo} = require('./index');

describe('handlerTwo', () => {
    it('returns a successful response with the event', async () => {
        const event = {key: 'value'};
        const response = await handlerTwo(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            message: "Hahaha!",
            input: event,
        });
    });
});

describe('postHandlerTwo', () => {
    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore('S3');
    });

    it('returns a successful response with the event body', async () => {
        const event = {body: JSON.stringify({key: 'value'})};
        AWSMock.mock('S3', 'createBucket', Promise.resolve({Location: 'BucketLocation'}));

        const response = await postHandlerTwo(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({key: 'value'});
    });

    it('handles JSON parse error', async () => {
        const event = {body: 'invalid json'};
        AWSMock.mock('S3', 'createBucket', Promise.resolve({Location: 'BucketLocation'}));

        const response = await postHandlerTwo(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toBeNull();
    });
});