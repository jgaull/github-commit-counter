
const LINK_REGEX = /<(\S+)>; rel="(\S+)"/gm
const PAGE_REGEX = /(?:\?|&page=)(\d+)/

module.exports = class LinkParser {
    
    constructor (link) {

        let match
        let links = []
        while (match = LINK_REGEX.exec(link)) {
            this[match[2]] = new Link(match[1])
        }
    }
}

class Link {

    constructor (url) {
        this.url = url
        this.page = Number(url.match(PAGE_REGEX)[1])
    }
}