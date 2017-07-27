'use strict';

var ghComments = require('gh-issues-for-comments').default;
var omit = require('lodash/omit');

var defaultOpts = {
  filter: function filter() {
    return true;
  }
};

module.exports = function (userOpts) {
  var opts = Object.assign({}, defaultOpts, userOpts);

  return function (files, metalsmith, done) {
    // Array of only articles data
    var articles = Object.keys(files).filter(function (filepath) {
      var article = files[filepath];
      return article.collection && article.collection.indexOf('articles') !== -1 && opts.filter(article);
    }).map(function (filepath) {
      return files[filepath];
    });
    var ghCommentsOptions = omit(opts, ['filter']);

    ghComments(articles, ghCommentsOptions).then(function (createdIssues) {
      Object.keys(createdIssues).forEach(function (key) {
        var issueId = createdIssues[key].issueId;
        var article = Object.keys(files).map(function (filepath) {
          return files[filepath];
        }).find(function (article) {
          return article[opts.idProperty || 'id'] === key;
        });

        // Add `issueId` property to the article to be used in templates
        article.issueId = issueId;
      });
      done();
    }).catch(function (error) {
      return console.error('Error with issues creation', error);
    });
  };
};
