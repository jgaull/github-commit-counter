
const GitHubUrlParser = require('../parsers/github-url-parser')

module.exports = class GitHubAPIUrlFormatter {

    /**
     * 
     * @param {string} url a url returned in the response header from the GitHub API.
     */
    constructor (repoUrl) {

        //https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/

        let urlParser = new GitHubUrlParser(repoUrl)
        this.repoUrl = repoUrl
        this.owner = urlParser.owner
        this.repo = urlParser.repo
    }
    
    /**
     * 
     * @param {String} path The path to append to the base GitHub API URL. For example /pulls. Note: include a leading / and not a trailing /
     * @returns 
     */
    createUrlString(path) {

        const urlString = `https://api.github.com/repos/${this.owner}/${this.repo}${path}`
        return urlString
    }
}