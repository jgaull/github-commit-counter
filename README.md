
# Tasks
- [x] Integration test hello-world
- [x] Connect the VSCode Debugger
- [ ] Stub API
- [ ] Build a link parser
- [ ] Add unit test coverage for the link parser
- [ ] Implement the count commits endpoint
- [ ] Update integration test

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
- 10/20, PoC, 1:00pm ish?