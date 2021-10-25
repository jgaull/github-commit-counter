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
}

module.exports = async (url, options) => {
    
    const response = responses[url]

    const encodedResponse = {
        headers: response.headers,
        body: JSON.stringify(response.body)
    }

    if (response.statusCode != 200) {
        const error = new Error('Response code 403 (Forbidden)') //for now this is the only response error case the code is handling
        error.response = encodedResponse
        throw error
    }

    return encodedResponse
}