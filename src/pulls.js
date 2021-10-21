'use strict';

const MAX_RESULTS_PER_PAGE = 5 //keeping this low so I don't blow up my API request limits

module.exports.handler = (event, context, callback) => {

  const repoUrl = event.queryStringParameters.repo_url
  const perPage = Math.min(event.queryStringParameters.per_page, MAX_RESULTS_PER_PAGE)
    
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: 'there are probably 5 open pull requests',
  }

  callback(null, response)
}
