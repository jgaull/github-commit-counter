
/**
 * 
 * @param {String} message An error message to display to the API consumer
 * @param {Number} code An error code to categorize the error and give the consumer a path to handling. Defaults to 0.
 * @returns {Object} An error object formatted so the Lambda can return it.
 */
module.exports.objectForError = (message, code = 0) => {
    return {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            message,
            code
        }),
    }
}

/**
 * 
 * @param {Object} body The body of the response
 * @returns {Object} An success response object formatted so the Lambda can return it.
 */
module.exports.objectForSuccess = body => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(body),
    }
}

/**
 * This function will asynchronously count the number of commits for a specific pull request.
 * 
 * @param {Number} pullNumber The Pull number for the desired pull request
 * @param {GitHubAPIUrlFormatter} urlFormatter a pre-configured URL formatter
 * @returns 
 */
module.exports.countCommits = async (pullNumber, urlFormatter) => {

    const got = require('got')
    const LinkParser = require('../../parsers/link-parser')

    const listCommitsUrl = urlFormatter.createUrlString(`/pulls/${pullNumber}/commits`)
    
    let commitsResponse = await got(listCommitsUrl, {
      username: process.env.GIT_USERNAME, 
      password: process.env.GIT_PASSWORD,
      searchParams: {
        per_page: 1
      }
    })
  
    const link = commitsResponse.headers.link
      
    let commitCount = 1
    if (link) {
      commitCount = new LinkParser(link).last.page
    }
  
    return commitCount
  }