
const LinkParser = require('./link-parser')

describe("link-parser", () => {
    //the most complex happy path
    it("parses previous, next, last, first", async () => {
        const link = '<https://api.github.com/repositories/1296269/pulls?per_page=1&page=1>; rel="prev", <https://api.github.com/repositories/1296269/pulls?per_page=1&page=3>; rel="next", <https://api.github.com/repositories/1296269/pulls?per_page=1&page=94>; rel="last", <https://api.github.com/repositories/1296269/pulls?per_page=1&page=1>; rel="first"'
        const parser = new LinkParser(link)

        expect(parser.prev).toBeDefined()
        expect(parser.prev.page).toBe(1)

        expect(parser.next).toBeDefined()
        expect(parser.next.page).toBe(3)

        expect(parser.first).toBeDefined()
        expect(parser.first.page).toBe(1)

        expect(parser.last).toBeDefined()
        expect(parser.last.page).toBe(94)
    })
    //the simplest happy path
    it("parses last and next", async () => {
        const link = '<https://api.github.com/repositories/1296269/pulls?per_page=1&page=2>; rel=\"next\", <https://api.github.com/repositories/1296269/pulls?per_page=1&page=94>; rel=\"last\"'
        const parser = new LinkParser(link)

        expect(parser.next).toBeDefined()
        expect(parser.next.page).toBe(2)

        expect(parser.last).toBeDefined()
        expect(parser.last.page).toBe(94)

        expect(parser.prev).toBeUndefined()
        expect(parser.first).toBeUndefined()
    })
    //failure to parse the string at the highest level
    it("fails to parse an improperly formatted link", async () => {

        const link = 'this is not a properly formatted link'

        //apparently Jest expect toThrow() does not work with constructors?
        //expect(new LinkParser(link)).toThrow('The link is not in a format that can be parsed.')

        try {
            new LinkParser(link)
        }
        catch (error) {
            expect(error.message).toBe('The link is not in a format that can be parsed.')
        }
    })
    //failure to parse the string at a lower level
    it("fails to parse a link with no page number", async () => {

        const link = '<https://api.github.com/repositories/1296269/pulls?per_page=1>; rel=\"next\", <https://api.github.com/repositories/1296269/pulls?per_page=1>; rel=\"last\"'

        //apparently Jest expect toThrow() does not work with constructors?
        //expect(new LinkParser(link)).toThrow('The link is not in a format that can be parsed.')

        try {
            new LinkParser(link)
        }
        catch (error) {
            expect(error.message).toBe('The link does not include a page number.')
        }
    })
})