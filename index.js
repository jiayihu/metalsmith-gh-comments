const ghComments = require('gh-issues-for-comments').default;
const omit = require('lodash/omit');

const defaultOpts = {
  filter: () => true,
};

module.exports = function(userOpts) {
  const opts = Object.assign({}, defaultOpts, userOpts);

  return (files, metalsmith, done) => {
    // Array of only articles data
    const articles = Object.keys(files)
      .filter(filepath => {
        const article = files[filepath];
        return (
          article.collection &&
          article.collection.indexOf('articles') !== -1 &&
          opts.filter(article)
        );
      })
      .map(filepath => files[filepath]);
    const ghCommentsOptions = omit(opts, ['filter']);

    ghComments(articles, ghCommentsOptions)
      .then(createdIssues => {
        Object.keys(createdIssues).forEach(key => {
          const issueId = createdIssues[key].issueId;
          const article = Object.keys(files)
            .map(filepath => files[filepath])
            .find(article => article[opts.idProperty || 'id'] === key);

          // Add `issueId` property to the article to be used in templates
          article.issueId = issueId;
        });
        done();
      })
      .catch(error => console.error('Error with issues creation', error));
  };
};
