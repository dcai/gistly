const { Octokit } = require('@octokit/rest');

async function updateIndex(token, gistId, content) {
  const octokit = new Octokit({
    auth: token,
  });
  await octokit.gists.update({
    gist_id: gistId,
    files: {
      'index.md': {
        content,
      },
    },
  });
}

module.exports = {
  updateIndex,
};
