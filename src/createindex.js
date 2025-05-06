async function createIndex(token, content) {
  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'gist index',
      public: true,
      files: {
        'index.md': {
          content,
        },
      },
    }),
  });

  return response.json();
}
module.exports = {
  createIndex,
};
