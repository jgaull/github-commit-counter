'use strict';

const got = require('got')

const utils = require('./shared/utils')
const GitHubAPIUrlFormatter = require('../formatters/github-api-url-formatter')

const MAX_RESULTS_PER_PAGE = 5 //keeping this low so I don't blow up my API request limits
const DEFAULT_RESULTS_PER_PAGE = 3

module.exports.handler = async (event, context) => {

  //enforces the number of results in a single request as set by MAX_RESULTS_PER_PAGE
  const perPage = Math.min(event.queryStringParameters.per_page, MAX_RESULTS_PER_PAGE) || DEFAULT_RESULTS_PER_PAGE

  //ensure the repo_url paramater exists
  const repoUrl = event.queryStringParameters.repo_url
  if (!repoUrl) {
    return utils.objectForError('repo_url is a required paramater')
  }

  //validate the github URL to make sure it has both an owner and a repo
  //validate the github URL to make sure it has both an owner and a repo
  let urlFormatter
  try {
    urlFormatter = new GitHubAPIUrlFormatter(repoUrl)
  }
  catch (error) {
    return utils.objectForError(`Error parsing github url: ${error.message}`)
  }

  //create the list pulls request URL
  const listPullsUrl = urlFormatter.createUrlString(`/pulls`)

  let pullsBody
  try {
    //make the request to the github API and parse the response
    const response = await got(listPullsUrl, {
      username: process.env.GIT_USERNAME,
      password: process.env.GIT_PASSWORD,
      searchParams: {
        per_page: perPage,
        state: 'open'
      }
    })
    pullsBody = JSON.parse(response.body)
  }
  catch (error) {
    return utils.objectForError(`Error loading pull requests from the GitHub API: ${error.message}`)
  }

  //the commitsRequests array holds a promise for each commits request
  const commitsRequests = pullsBody.map(pull => {
    //using per_page=1 ensures that there is only one commit per page. 
    //This lets us use the github API's pagination system to efficiently obtain a count of all commits.
    return utils.countCommits(pull.number, urlFormatter)
  })

  let commitCounts
  try {
    //Responses will be stored in an array after all requests are successfully fulfilled by the github API
    //If any request fails the catch() block will run
    commitCounts = await Promise.all(commitsRequests)
  }
  catch (error) {
    return utils.objectForError(`Error loading commit counts from the GitHub API: ${error.message}`)
  }
  
  const pulls = commitCounts.map((commitCount, index) => {

    //Commits responses are stored in the same order as the commit counts (this is how Promise.all works)
    //We can assume each commit response has the same index as its corresponding pull
    const pull = pullsBody[index]

    //The endpoint modifies the response from the GitHub API by adding the commit_count property to each pull
    //Since the consumer of this data would likely need information for each Pull in addition to the commit_count
    //I decided to include the entire response + one additional field for each Pull
    pull.commit_count = commitCount
    return pull
  })
  
  //return a success response
  return utils.objectForSuccess(pulls)
}
