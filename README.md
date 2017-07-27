# metalsmith-gh-comments

[![npm](https://img.shields.io/npm/v/metalsmith-gh-comments.svg)](https://www.npmjs.com/package/metalsmith-gh-comments)

Metalsmith plugin to automatically open a **Github issue as blog comments** for every articles of your blog. It also creates a `gh-comments.json` file to keep track of created issues. Uses [gh-issues-for-comments](https://github.com/jiayihu/gh-issues-for-comments) under the hood.

**Notes**: a property `issueId` is added to each article for templates usage.

## Install

```
npm install metalsmith-gh-comments --save
```

## Usage

### CLI usage

Install via npm and then add the `metalsmith-gh-comments` key to your `metalsmith.json` plugins with any [gh-issues-for-comments](https://github.com/jiayihu/gh-issues-for-comments) option you want.

For more powerful options see [#javascript-usage](#javascript-usage).

```json
{
  "plugins": {
    "metalsmith-gh-comments": {
      "username": "jiayihu",
      "repo": "blog",
      "token": "123GithubOAuthToken",
    }
  }
}
```

### Javascript usage

It's recommended to configure this plugin along with [metalsmith-filepath](https://github.com/lotaris/metalsmith-filepath), in order to use articles filepaths as unique properties since they don't have an id. The `title` could be used as well but it's more likely to change.

```javascript
const filepath = require('metalsmith-filepath');
const githubComments = require('metalsmith-gh-comments');

.use(filepath({ absolute: false }))
.use(
  githubComments({
    // Don't include 'About' article
    filter: article => article.title !== 'About', 

    // gh-issues-for-comments options
    idProperty: 'link', // property added by 'metalsmith-filepath'
    username: 'jiayihu',
    repo: 'blog',
    token: '123GithubOAuthToken'
  })
)
```

## Options

The following options can be provided:

- `filter`

  Type: `(article) => boolean`

  Filter which articles must have an issue for comments

Any other options will be passed to [gh-issues-for-comments](https://github.com/jiayihu/gh-issues-for-comments). Check the package to see all available options.
