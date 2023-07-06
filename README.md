
# changelogithub-action

<a href="https://github.com/actions/typescript-action/actions"><img alt="build status" src="https://github.com/bitxeno/changelogithub-action/workflows/build/badge.svg"></a>


A GitHub action to generate changelog with [Conventional Commits](https://www.conventionalcommits.org/). Powered by [`changelogithub`](https://github.com/antfu/changelogithub)

## Usage

```
- uses: bitxeno/changelogithub-action@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    output-file: ./docs/CHANGELOG.md
    types: |
      feat
      fix
      perf
      refactor
      tweak
    #   docs
    #   build
    #   test
    #   style
    #   ci
    #   chore
    #   improve
```

### Inputs

The following `inputs` are available:

| Name           | Description                                                                     | Required |
| -------------- | ------------------------------------------------------------------------------- | :------: |
| `token`        | The GitHub Token to use.                                                        |    ✅    |
| `capitalize`   | Capitalize commit messages.                                                     |          |
| `contributors` | Whether to include contributors in release notes.                               |          |
| `draft`        | Mark the release as a draft.                                                    |          |
| `dry`          | Dry run. Skip releasing to GitHub.                                              |          |
| `emoji`        | Use emojis in section titles.                                                   |          |
| `from`         | The start commit reference. When not provided, the latest git tag is used.      |          |
| `github`       | The owner/repository identifier.                                                |          |
| `group`        | Nest commit messages under their scopes.                                        |          |
| `name`         | Name of the release.                                                            |          |
| `prerelease`   | Mark the release as prerelease.                                                 |          |
| `to`           | The end commit reference. When not provided, the latest commit in HEAD is used. |          |
| `types`        | generate log types filter.  (based on the [angular](https://github.com/angular/angular/blob/68a6a07/CONTRIBUTING.md#commit))                                                    |          |
| `output-file`  | File to output the changelog to.                                                |          |


### Outputs

The following `outputs` are available:

| Name                        | Description                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------ | 
| `changelog`                 | The generated changelog for the new version.                                                     | 
| `changelog_with_version`    | The generated changelog for the new version with version header. (Better for CHANGELOG.md file). |

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```


