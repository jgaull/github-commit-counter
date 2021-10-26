
# About
This NodeJS application is designed to run on AWS Lambda. Its purpose is to count the number of commits for a single PR or a list of PRs and return the result to the consumer.

In order to efficiently implement the core algorithm the count is obtained using the `link` parameter in the reponse header where `commit_count = rel="last" page * per_page`. Note that the example `link` below has a `next` and a `last` page. Since the `per_page` limit is set to 1 commit we can assume that the `commit_count` is equal to the `page` parameter in the link which is associated with `last`. In the below case `commit_count = page = 3`.

```
link: <https://api.github.com/repositories/1296269/pulls/88/commits?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1296269/pulls/88/commits?per_page=1&page=3>; rel="last"
```

# Environment setup

## Install Dependencies
```
npm install
npm install -g serverless
```

## Add credentials for AWS
```
serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret> -o
```

I added the `-o` parameter becaused I received the below error:

```
Profile "default" is already configured in ~/.aws/credentials. Use the overwrite flag ("-o" or "--overwrite") to force the update.
```

# Running tests
With VSCode Installed you can use the built in debugger. Use the `Run all tests` debug profile and click the run button.

You can also run the tests directly using `npm test`.

# Deploying
```
npm run deploy
```

# ToDo
- [x] Integration test hello-world
- [x] Connect the VSCode Debugger
- [x] Stub API
- [x] Build a link parser
- [x] Add unit test coverage for the link parser
- [x] Add basic auth to github API requests
- [x] Implement the count commits endpoint
- [x] Update integration test
- [x] Add support for http in GitHubUrlParser
- [x] Add commits_count for get pull endpoint
- [x] Clean up README
- [ ] There is no test coverage for commits == 1 (out of scope)
- [ ] Error is not descriptive when repo_url is not set when running on AWS (out of scope)
- [ ] Basic auth is not working with the GitHub API (out of scope)
- [ ] Unit tests for github-api-url-formatter (out of scope)
- [ ] Add a linter (out of scope)

# Time Tracking
- 10/19, Initial planning, 0.5h
- 10/20, project scaffold, 1:00pm ish? - 5:00pm ish?
- 10/21, endpoint PoC, 12:00pm - 1:15pm
- 10/21, capture responses + link parser, 4:00 - 6:30
- 10/22, link parser polish, 11:00am - 12:00pm
- 10/22, pulls endpoint implementation, 1pm - 5pm
- 10/25, added polish to pulls endpoint, 1:30pm - 5:30pm
- 10/26, a few last bits and pieces, 10:00 - 11:00am