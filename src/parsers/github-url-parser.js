
//Pulls out the owner and repo from the path provided
//Assumes all owners and repo names contain only a-z, 0-9, and the - (dash) characters
//There are probably owner and repo names that will break this
const REGEX = /https?:\/\/(?:www\.)?github\.com\/([a-z0-9\-]+)\/([a-z0-9\-]+)/

module.exports = class GitHubUrlParser {

    /**
     * 
     * @param {string} url a url returned in the response header from the GitHub API. Must have a page=N query paramater.
     */
    constructor (url) {

        url = url.toLowerCase()
        this.url = url

        //pulls the owner and repo out of the provided URL
        const match = url.match(REGEX)
        //if the url is not a valid GitHub url
        if (!match || match.length < 3) {
            throw new Error('The provided url is not a valid GitHub repository url')
        }

        this.owner = match[1]
        this.repo = match[2]
    }
}