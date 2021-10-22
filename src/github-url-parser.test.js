
const GitHubUrlParser = require('./github-url-parser')

describe("link-parser", () => {

    //a simple happy path
    it("parses a valid github repo url", async () => {
        const url = 'https://github.com/colinhacks/zod/'
        const parser = new GitHubUrlParser(url)

        expect(parser.owner).toBe('colinhacks')
        expect(parser.repo).toBe('zod')
    })

    //a more complex happy path
    it("parses a more complex valid github repo url", async () => {
        const url = 'https://www.github.com/colin-hacks123/zod-zod789/'
        const parser = new GitHubUrlParser(url)

        expect(parser.owner).toBe('colin-hacks123')
        expect(parser.repo).toBe('zod-zod789')
    })

    //failure to parse the string at the highest level
    it("fails to parse an improperly formatted github url", async () => {

        const url = 'https://www.google.com/nobody/nothing'

        try {
            new GitHubUrlParser(url)
        }
        catch (error) {
            expect(error.message).toBe('The provided url is not a valid GitHub repository url')
        }
    })
})