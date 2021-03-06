
//this file mocks the behavior of the got module for testing purposes.
//It is automatically used when running jest tests

//key value pairs or request URLs and responses
const responses = {
    'https://api.github.com/repos/octocat/hello-world/pulls?per_page=3&state=open': require('./pulls-mock-response.json'),
    'https://api.github.com/repos/octocat/hello-world/pulls/1073/commits?per_page=1': require('./commits-mock-reponse.json'),
    'https://api.github.com/repos/octocat/hello-world/pulls/1072/commits?per_page=1': require('./commits-mock-reponse.json'),
    'https://api.github.com/repos/octocat/hello-world/pulls/1071/commits?per_page=1': require('./commits-mock-reponse.json'),
    'https://api.github.com/repos/rate-limiter/pulls-test/pulls?per_page=3&state=open': require('./rate-limit-error-mock-reponse.json'),
    'https://api.github.com/repos/rate-limiter/commits-test/pulls?per_page=3&state=open': require('./pulls-mock-response.json'),
    'https://api.github.com/repos/rate-limiter/commits-test/pulls/1073/commits?per_page=1': require('./rate-limit-error-mock-reponse.json'),
    'https://api.github.com/repos/rate-limiter/commits-test/pulls/1072/commits?per_page=1': require('./rate-limit-error-mock-reponse.json'),
    'https://api.github.com/repos/rate-limiter/commits-test/pulls/1071/commits?per_page=1': require('./rate-limit-error-mock-reponse.json'),
    'https://api.github.com/repos/octocat/hello-world/pulls/1071': require('./get-pull-mock-response.json'),
    'https://api.github.com/repos/rate-limiter/pulls-test/pulls/1071': require('./rate-limit-error-mock-reponse.json'),
    'https://api.github.com/repos/rate-limiter/commits-test/pulls/1071': require('./rate-limit-error-mock-reponse.json')
}

module.exports = async (url, options) => {
    //parse the query paramaters
    const searchParams = options.searchParams
    if (searchParams) {
        url += '?'

        for (const key in searchParams) {

            if (Object.hasOwnProperty.call(searchParams, key)) {
                const value = searchParams[key]
                url+= `${key}=${value}&`
            }
        }

        url = url.slice(0, -1)
    }
    //look up the mock response
    const response = responses[url]
    //throw a helpful error if not mock is configured
    if (!response) {
        throw new Error(`No mock response configured for url: ${url}`)
    }
    //build the response so it looks like the real thing
    const encodedResponse = {
        headers: response.headers,
        body: JSON.stringify(response.body)
    }
    //if the response is an error response then throw an error instead of returning
    if (response.statusCode != 200) {
        const error = new Error('Response code 403 (Forbidden)') //for now this is the only response error case the code is handling
        error.response = encodedResponse
        throw error
    }

    return encodedResponse
}