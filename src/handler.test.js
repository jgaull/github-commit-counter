
const handler = require('./handler')

describe("hello world", () => {

    it("GET", async () => {

        const event = {}
        const context = {}

        handler.helloWorld(event, context, (error, response) => {

            expect(error).toBeFalsy()
            expect(response).toBeDefined()

            const body = JSON.parse(response.body)
            expect(body.message).toEqual('Go Serverless v1.0! Your function executed successfully!')
            expect(body.input).toBeDefined()
        })
    })
})