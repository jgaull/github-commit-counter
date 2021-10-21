
const { handler } = require('./pulls')

describe("pulls", () => {

    it("lists open pull requests", async () => {

        const event = {
            resource: "/hello-world",
            path: "/hello-world",
            httpMethod: "GET",
            "headers": {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "CloudFront-Forwarded-Proto": "https",
                "CloudFront-Is-Desktop-Viewer": "true",
                "CloudFront-Is-Mobile-Viewer": "false",
                "CloudFront-Is-SmartTV-Viewer": "false",
                "CloudFront-Is-Tablet-Viewer": "false",
                "CloudFront-Viewer-Country": "US",
                "Host": "15byt5ikm1.execute-api.us-east-1.amazonaws.com",
                "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
                "Via": "2.0 ba51bb9649a17fe3932d945cc355c923.cloudfront.net (CloudFront)",
                "X-Amz-Cf-Id": "dmSoGQMO6RkG9UHEiaW3ExYPNhMfmRj3nQGLFXTEPSu3fEvySNeiFA==",
                "X-Amzn-Trace-Id": "Root=1-6171c2ca-66a66f55552a17465c18a7a4",
                "X-Forwarded-For": "157.131.170.92, 130.176.157.72",
                "X-Forwarded-Port": "443",
                "X-Forwarded-Proto": "https"
            },
            "multiValueHeaders": {
                "Accept": ["text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"],
                "Accept-Encoding": ["gzip, deflate, br"],
                "Accept-Language": ["en-US,en;q=0.9"],
                "CloudFront-Forwarded-Proto": ["https"],
                "CloudFront-Is-Desktop-Viewer": ["true"],
                "CloudFront-Is-Mobile-Viewer": ["false"],
                "CloudFront-Is-SmartTV-Viewer": ["false"],
                "CloudFront-Is-Tablet-Viewer": ["false"],
                "CloudFront-Viewer-Country": ["US"],
                "Host": ["15byt5ikm1.execute-api.us-east-1.amazonaws.com"],
                "sec-ch-ua": ["\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\""],
                "sec-ch-ua-mobile": ["?0"],
                "sec-ch-ua-platform": ["\"macOS\""],
                "sec-fetch-dest": ["document"],
                "sec-fetch-mode": ["navigate"],
                "sec-fetch-site": ["none"],
                "sec-fetch-user": ["?1"],
                "upgrade-insecure-requests": ["1"],
                "User-Agent": ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"],
                "Via": ["2.0 ba51bb9649a17fe3932d945cc355c923.cloudfront.net (CloudFront)"],
                "X-Amz-Cf-Id": ["dmSoGQMO6RkG9UHEiaW3ExYPNhMfmRj3nQGLFXTEPSu3fEvySNeiFA=="],
                "X-Amzn-Trace-Id": ["Root=1-6171c2ca-66a66f55552a17465c18a7a4"],
                "X-Forwarded-For": ["157.131.170.92, 130.176.157.72"],
                "X-Forwarded-Port": ["443"],
                "X-Forwarded-Proto": ["https"]
            },
            "queryStringParameters": {
                "repo_url": "https://github.com/octocat/Hello-World/"
            },
            "multiValueQueryStringParameters": {
                "repo_url": ["https://github.com/octocat/Hello-World/"]
            },
            "pathParameters": null,
            "stageVariables": null,
            "requestContext": {
                "resourceId": "wr3ifu",
                "resourcePath": "/hello-world",
                "httpMethod": "GET",
                "extendedRequestId": "HktfmFmHoAMFkMA=",
                "requestTime": "21/Oct/2021:19:43:06 +0000",
                "path": "/dev/hello-world",
                "accountId": "720769279455",
                "protocol": "HTTP/1.1",
                "stage": "dev",
                "domainPrefix": "15byt5ikm1",
                "requestTimeEpoch": 1634845386017,
                "requestId": "cd52b747-2b2f-4afb-adab-bb4813c2c55c",
                "identity": {
                    "cognitoIdentityPoolId": null,
                    "accountId": null,
                    "cognitoIdentityId": null,
                    "caller": null,
                    "sourceIp": "157.131.170.92",
                    "principalOrgId": null,
                    "accessKey": null,
                    "cognitoAuthenticationType": null,
                    "cognitoAuthenticationProvider": null,
                    "userArn": null,
                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
                    "user": null
                },
                "domainName": "15byt5ikm1.execute-api.us-east-1.amazonaws.com",
                "apiId": "15byt5ikm1"
            },
            "body": null,
            "isBase64Encoded": false
        }

        const context = {}

        handler(event, context, (error, response) => {

            expect(error).toBeFalsy()
            expect(response.body).toBe('there are probably 5 open pull requests')
        })
    })
})