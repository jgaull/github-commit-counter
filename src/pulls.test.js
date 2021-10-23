
require('dotenv').config()

const { handler } = require('./pulls')

describe("pulls", () => {

    it("lists open pull requests", async () => {

        const event = require('./pulls-request.json')
        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(Array.isArray(parsed)).toBe(true)
        expect(parsed.length).toBe(3)

        expect(parsed[0].commit_count).toBe(3)
        expect(parsed[1].commit_count).toBe(3)
        expect(parsed[2].commit_count).toBe(3)
    })

    it("returns an error when the repo_url is not set", async () => {

        const event = require('./pulls-request.json')
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

        const event = require('./pulls-request.json')
        event.queryStringParameters.repo_url = 'http://www.google.com/nobody/nothing/'

        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(500)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(parsed.message).toBe('Error parsing github url: The provided url is not a valid GitHub repository url')
        expect(parsed.code).toBe(0)
    })

    it("returns an error when the repo_url is not valid", async () => {

        const event = require('./pulls-request.json')
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

        const event = require('./pulls-request.json')
        event.queryStringParameters.repo_url = 'https://github.com/rate-limiter/pulls-test/'

        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(500)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(parsed.message).toBe('Error loading pull requests from the GitHub API: Response code 403 (Forbidden)')
        expect(parsed.code).toBe(0)
    })

    it("returns an error when the rate limit is exceeded when listing commits", async () => {

        const event = require('./pulls-request.json')
        event.queryStringParameters.repo_url = 'https://github.com/rate-limiter/commits-test/'

        const context = {}
        const response = await handler(event, context)
        
        expect(response.statusCode).toBe(500)
        expect(response.body).toBeDefined()
        
        const parsed = JSON.parse(response.body)
        expect(parsed.message).toBe('Error loading commits from the GitHub API: Response code 403 (Forbidden)')
        expect(parsed.code).toBe(0)
    })
})