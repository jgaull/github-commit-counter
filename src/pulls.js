'use strict';

const got = require('got')

const LinkParser = require('./link-parser')
const GitHubUrlParser = require('./github-url-parser')

const MAX_RESULTS_PER_PAGE = 5 //keeping this low so I don't blow up my API request limits
const DEFAULT_RESULTS_PER_PAGE = 3

module.exports.handler = async (event, context) => {

  //enforces the number of results in a single request as set by MAX_RESULTS_PER_PAGE
  const perPage = Math.min(event.queryStringParameters.per_page, MAX_RESULTS_PER_PAGE) || DEFAULT_RESULTS_PER_PAGE

  //ensure the repo_url paramater exists
  const repoUrl = event.queryStringParameters.repo_url
  if (!repoUrl) {
    return objectForError('repo_url is a required paramater')
  }

  //validate the github URL to make sure it has both an owner and a repo
  let owner
  let repo
  try {
    const urlParser = new GitHubUrlParser(repoUrl)
    owner = urlParser.owner
    repo = urlParser.repo
  }
  catch (error) {
    return objectForError(`Error parsing github url: ${error.message}`)
  }

  //create the list pulls request URL
  const listPullsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?per_page=${perPage}&state=open`

  let pullsBody
  let pullsHeaders
  try {
    //make the request to the github API and parse the response
    const response = await got(listPullsUrl, { username: process.env.GIT_USERNAME, password: process.env.GIT_PASSWORD })
    pullsBody = JSON.parse(response.body)
    pullsHeaders = response.headers
  }
  catch (error) {
    return objectForError(`Error loading pull requests from the GitHub API: ${error.message}`)
  }

  //the commitsRequests array holds a promise for each commits request
  const commitsRequests = pullsBody.map(value => {
    //using per_page=1 ensures that there is only one commit per page. 
    //This lets us use the github API's pagination system to efficiently obtain a count of all commits.
    return got(`https://api.github.com/repos/${owner}/${repo}/pulls/${value.number}/commits?per_page=1`, { username: process.env.GIT_USERNAME, password: process.env.GIT_PASSWORD })
  })

  let commitsResponses
  try {
    //Responses will be stored in an array after all requests are successfully fulfilled by the github API
    //If any request fails the catch() block will run
    commitsResponses = await Promise.all(commitsRequests)
  }
  catch (error) {
    return objectForError(`Error loading commits from the GitHub API: ${error.message}`)
  }
  
  const pulls = commitsResponses.map((response, index) => {

    const link = response.headers.link
    
    let commitCount = 1
    if (link) {
      commitCount = new LinkParser(link).last.page
    }

    //Commits responses are stored in the same order as the pulls
    //We can assume each commit response has the same index as its corresponding pull
    const pull = pullsBody[index]

    //The endpoing modifies the response from the GitHub API by adding the commit_count property to each pull
    //Since the consumer of this data would likely need information for each Pull in addition to the commit_count
    //I decided to just include the entire response + one additional field for each Pull
    pull.commit_count = commitCount
    return pull
  })
  
  //return a success response
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(pulls),
  }
}

/**
 * 
 * @param {String} message An error message to display to the API consumer
 * @param {Number} code An error code to categorize the error and give the consumer a path to handling. Defaults to 0.
 * @returns {Object} An error object formatted so the Lambda can return it.
 */
function objectForError(message, code = 0) {
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
