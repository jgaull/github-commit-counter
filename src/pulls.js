'use strict';

const got = require('got')

const LinkParser = require('./link-parser')
const GitHubUrlParser = require('./github-url-parser')

const MAX_RESULTS_PER_PAGE = 3 //keeping this low so I don't blow up my API request limits

module.exports.handler = async (event, context) => {

  const perPage = Math.min(event.queryStringParameters.per_page, MAX_RESULTS_PER_PAGE) || MAX_RESULTS_PER_PAGE

  //need to parse the repoUrl to obtain these
  const repoUrl = event.queryStringParameters.repo_url
  if (!repoUrl) {
    return objectForError('repo_url is a required paramater')
  }

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

  const listPullsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?per_page=${perPage}&state=open`

  let pullsBody
  let pullsHeaders
  try {
    const response = await got(listPullsUrl, { username: process.env.GIT_USERNAME, password: process.env.GIT_PASSWORD })
    pullsBody = JSON.parse(response.body)
    pullsHeaders = response.headers
  }
  catch (error) {
    return objectForError(`Error loading pull requests from the GitHub API: ${error.message}`)
  }

  const commitsRequests = pullsBody.map(value => {
    return got(`https://api.github.com/repos/${owner}/${repo}/pulls/${value.number}/commits?per_page=1`, { username: process.env.GIT_USERNAME, password: process.env.GIT_PASSWORD })
  })

  let commitsResponses
  try {
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

    const pull = pullsBody[index]
    pull.commit_count = commitCount
    return pull
  })
    
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(pulls),
  }
}

function objectForError(message, code = 0) {
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message,
      code
    }),
  }
}
