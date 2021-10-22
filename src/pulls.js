'use strict';

const got = require('got')
//const LinkParser = require('./link-parser')

const MAX_RESULTS_PER_PAGE = 3 //keeping this low so I don't blow up my API request limits

module.exports.handler = async (event, context) => {

  const repoUrl = event.queryStringParameters.repo_url
  const perPage = Math.min(event.queryStringParameters.per_page, MAX_RESULTS_PER_PAGE) || MAX_RESULTS_PER_PAGE

  //need to parse the repoUrl to obtain these
  const owner = 'octocat'
  const repo = 'hello-world'

  const listPullsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?per_page=${perPage}`

  let pullsBody
  let pullsHeaders
  try {
    const response = await got(listPullsUrl)
    pullsBody = JSON.parse(response.body)
    pullsHeaders = response.headers

    console.log('headers: ', JSON.stringify(pullsHeaders))
  }
  catch (error) {

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: 'Error loading pull requests from the GitHub API',
        code: 1
      }),
    }
  }

  const commitsRequests = pullsBody.map(value => {
    return got(`https://api.github.com/repos/${owner}/${repo}/pulls/${value.number}/commits?per_page=1`)
  })

  const commitsResponses = await Promise.all(commitsRequests)

  const commits = commitsResponses.map(response => {

    const link = response.headers.link
    
    let commitCount = 1
    if (link) {
      //find the link for the last page
      //pull out the page number paramater
      //commitCount = new LinkParser(link).last.page
    }

    return {
      body: JSON.parse(response.body),
      headers: response.headers
    }
  })

  console.log('commits: ', JSON.stringify(commits))

  /*
  let commitsBody
  let commitsHeaders
  try {
    const response = await got(listCommitsUrl)
    commitsBody = JSON.parse(response.body)
    commitsHeaders = response.headers
  }
  catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: `Error loading commits from the GitHub API: ${error.message}`,
        code: 1
      }),
    }
  }
  */
  
    
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: 'there are probably 5 open pull requests',
  }
}
