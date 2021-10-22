
const responses = {
    'https://api.github.com/repos/octocat/hello-world/pulls?per_page=3&state=open': require('./pulls-mock-response.json'),
    'https://api.github.com/repos/octocat/hello-world/pulls/1073/commits?per_page=1': require('./commits-mock-reponse.json'),
    'https://api.github.com/repos/octocat/hello-world/pulls/1072/commits?per_page=1': require('./commits-mock-reponse.json'),
    'https://api.github.com/repos/octocat/hello-world/pulls/1071/commits?per_page=1': require('./commits-mock-reponse.json'),
}

module.exports = async (url, options) => {

    const response = responses[url]
    return {
        body: JSON.stringify(response.body),
        headers: response.headers
    }
}