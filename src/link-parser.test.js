
const LinkParser = require('./link-parser')

describe.only("link-parser", () => {

    it("parses previous, next, last, first", async () => {
        const link = '<https://api.github.com/repositories/1296269/pulls?per_page=3&page=1>; rel="prev", <https://api.github.com/repositories/1296269/pulls?per_page=3&page=3>; rel="next", <https://api.github.com/repositories/1296269/pulls?per_page=3&page=94>; rel="last", <https://api.github.com/repositories/1296269/pulls?per_page=3&page=1>; rel="first"'
        const parser = new LinkParser(link)
        console.log(link.last)
    })
})