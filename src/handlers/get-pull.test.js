
require('dotenv').config()

const { handler } = require('./get-pull')

//For this suite of tests the got module is mocked by Jest automatically.
//This improves the stability of the tests and shortens the time it takes to run
//It also keeps us from blowing up our GitHub API rate limit every time we run the test suite
describe("get-pull", () => {

    //Happy path test
    it("gets a pull request", async () => {

        const event = require('./get-pull-request.test.json')
        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        //for simplicity the mock data only has one response to the commits request meaning all commit_counts will equal the same number when tested
        //in production we would want to cover the case where commit_count = 1 since the GitHub API returns a different link property
        expect(parsed.commit_count).toBe(3)
    })

    //Error path tests
    it("returns an error when the repo_url is not set", async () => {

        const event = require('./get-pull-request.test.json')
        delete event.queryStringParameters.repo_url

        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(500)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(parsed.message).toBe('repo_url is a required paramater')
        expect(parsed.code).toBe(0)
    })

    it("returns an error when the repo_url is not valid", async () => {

        const event = require('./get-pull-request.test.json')
        event.queryStringParameters.repo_url = 'http://www.google.com/nobody/nothing/'

        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(500)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(parsed.message).toBe('Error parsing github url: The provided url is not a valid GitHub repository url')
        expect(parsed.code).toBe(0)
    })

    it("returns an error when the rate limit is exceeded when listing pulls", async () => {

        const event = require('./get-pull-request.test.json')
        event.queryStringParameters.repo_url = 'https://github.com/rate-limiter/pulls-test/'

        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(500)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(parsed.message).toBe('Error loading pull request 1071 from the GitHub API: Response code 403 (Forbidden)')
        expect(parsed.code).toBe(0)
    })

    it("returns an error when the rate limit is exceeded when listing commits", async () => {

        const event = require('./get-pull-request.test.json')
        event.queryStringParameters.repo_url = 'https://github.com/rate-limiter/commits-test/'

        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(500)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(parsed.message).toBe('Error loading pull request 1071 from the GitHub API: Response code 403 (Forbidden)')
        expect(parsed.code).toBe(0)
    })
})