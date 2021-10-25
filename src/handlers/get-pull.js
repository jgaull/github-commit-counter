'use strict';

const got = require('got')

const LinkParser = require('../parsers/link-parser')
const GitHubUrlParser = require('../parsers/github-url-parser')

module.exports.handler = async (event, context) => {

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

  const pullNumber = event.queryStringParameters.pull_number
  if (!pullNumber) {
      return objectForError(`pull_number is a required paramater`)
  }

  //create the list pulls request URL
  const getPullUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/`

  let pull
  try {
    //make the request to the github API and parse the response
    const response = await got(getPullUrl, { username: process.env.GIT_USERNAME, password: process.env.GIT_PASSWORD })
    pull = JSON.parse(response.body)
  }
  catch (error) {
    return objectForError(`Error loading pull request ${pullNumber} from the GitHub API: ${error.message}`)
  }

  let commitsResponse
  const listCommitsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/commits?per_page=1`
  try {
    commitsResponse = await got(listCommitsUrl, { username: process.env.GIT_USERNAME, password: process.env.GIT_PASSWORD })
  }
  catch (error) {
    return objectForError(`Error loading commits from the GitHub API: ${error.message}`)
  }

  const link = commitsResponse.headers.link
    
  let commitCount = 1
  if (link) {
    commitCount = new LinkParser(link).last.page
  }

  //The endpoint modifies the response from the GitHub API by adding the commit_count property to the pull
  //I did this because I assumed the consumer of this data would likely need information for each Pull in addition to the commit_count
  //An easy way to ensure that I met my consumer's needs was to include the entire response + one additional field so that's how I implemented the solution.
  pull.commit_count = commitCount
  
  //return a success response
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(pull),
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
