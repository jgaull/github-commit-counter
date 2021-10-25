
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

module.exports.objectForSuccess = body => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(body),
    }
}