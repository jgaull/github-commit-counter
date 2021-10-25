
//Breaks the link down into each url and rel components
const LINK_REGEX = /<(\S+)>; rel="(\S+)"/gm

//Pulls the page number out of the url
const PAGE_REGEX = /(?:\?|&page=)(\d+)/

module.exports = class LinkParser {
    /**
     * 
     * @param {string} link The link property contained in the response header from the GitHub API.
     */
    constructor (link) {

        let match
        let links = []
        //finds every url + rel pair in the string
        while (match = LINK_REGEX.exec(link)) {
            //instantiate a new Link for each url + rel pair
            const link = new Link(match[1])
            links.push(link)
            this[match[2]] = link
        }
        //if there are no Links it means we got an invalid link string
        if (links.length == 0) {
            throw new Error('The link is not in a format that can be parsed.')
        }
    }
}

class Link {

    /**
     * 
     * @param {string} url a url returned in the response header from the GitHub API. Must have a page=N query paramater.
     */
    constructor (url) {

        this.url = url

        //pulls the page number out of the url
        const match = url.match(PAGE_REGEX)
        //if there is not page number then the url is not valid
        if (!match || match.length < 2) {
            throw new Error('The link does not include a page number.')
        }

        this.page = Number(match[1])
    }
}