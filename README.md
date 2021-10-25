
# Tasks
- [x] Integration test hello-world
- [x] Connect the VSCode Debugger
- [x] Stub API
- [x] Build a link parser
- [x] Add unit test coverage for the link parser
- [x] Add basic auth to github API requests
- [x] Implement the count commits endpoint
- [x] Update integration test
- [x] Add support for http in GitHubUrlParser
- [ ] Add count commits for specific PR endpoint
- [ ] Clean up README
- [ ] Ensure code coverage exists for commits == 1 (putting this off)
- [ ] Error is not descriptive when repo_url is not set when running on AWS (why?)

# Notes

## List Open PRs
`https://api.github.com/repos/octocat/hello-world/pulls?state=open`

## Count Commits for PR
`https://api.github.com/repos/octocat/Hello-World/pulls/88/commits?per_page=1`

The count is obtained using the link parameter in the reponse header where `commit count = rel="last" page * items per page`
```link: <https://api.github.com/repositories/1296269/pulls/88/commits?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1296269/pulls/88/commits?per_page=1&page=3>; rel="last"```

## Serverless Package

Install
`sudo npm install -g serverless`

Add credentials for AWS
`serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret> -o`

I added the `-o` parameter becaused I received the below error:

```
Profile "default" is already configured in ~/.aws/credentials. Use the overwrite flag ("-o" or "--overwrite") to force the update.
```

`serverless create --template hello-world`

Deploy everything
`serverless deploy`

# Time Tracking
- 10/19, Initial planning, 0.5h
- 10/20, project scaffold, 1:00pm ish? - 5:00pm ish?
- 10/21, endpoint PoC, 12:00pm - 1:15pm
- 10/21, capture responses + link parser, 4:00 - 6:30
- 10/22, link parser polish, 11:00am - 12:00pm
- 10/22, pulls endpoint implementation, 1pm - 5pm
- 10/25, added polish to pulls endpoint, 1:30pm - 2:30pm