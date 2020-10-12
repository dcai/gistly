const { Octokit } = require('@octokit/rest');

async function createIndex(token, content) {
  const octokit = new Octokit({
    auth: token,
  });
  const gist = await octokit.gists.create({
    description: 'gist index',
    public: true,
    files: {
      'index.md': {
        content,
      },
    },
  });
  return gist;
}

module.exports = {
  createIndex,
};
