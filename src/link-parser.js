
const LINK_REGEX = /<(\S+)>; rel="(\S+)"/gm
const PAGE_REGEX = /(?:\?|&page=)(\d+)/

module.exports = class LinkParser {
    
    constructor (link) {

        let match
        let links = []
        while (match = LINK_REGEX.exec(link)) {
            const link = new Link(match[1])
            links.push(link)
            this[match[2]] = link
        }

        if (links.length == 0) {
            throw new Error('The link is not in a format that can be parsed.')
        }
    }
}

class Link {

    constructor (url) {
        this.url = url

        const match = url.match(PAGE_REGEX)
        if (!match || match.length < 2) {
            throw new Error('The link does not include a page number.')
        }

        this.page = Number(match[1])
    }
}