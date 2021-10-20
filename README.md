
# Notes

## List Open PRs
`https://api.github.com/repos/octocat/hello-world/pulls?state=open`

## Count Commits for PR
`https://api.github.com/repos/octocat/Hello-World/pulls/88/commits?per_page=1`

The count is obtained using the link parameter in the reponse header where `commit count = rel="last" page * items per page`
`link: <https://api.github.com/repositories/1296269/pulls/88/commits?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1296269/pulls/88/commits?per_page=1&page=3>; rel="last"`