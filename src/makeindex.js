async function makeIndex(token, options) {
  const endpoint = 'https://api.github.com/graphql';
  const privacy = options.includePrivate ? 'ALL' : 'PUBLIC';

  const query = `
    {
      viewer {
        login
        url
        gists(first: 100, orderBy: { field: CREATED_AT, direction: ${options.orderDirection} }, privacy: ${privacy}) {
          edges {
            node {
              isPublic
              files {
                encodedName
              }
              description
              name
              url
              createdAt
            }
          }
        }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  const login = data.viewer.login;
  const homeUrl = data.viewer.url;
  const gists = data.viewer.gists.edges;

  let txt = `## 📇 [@${login}](${homeUrl})'s gist index`;
  txt += '\n';
  gists.forEach((item) => {
    const gist = item.node;
    if (!gist.isPublic && !options.includePrivate) {
      return;
    }
    const hasOneFile = gist.files.length === 1;
    const files = gist.files
      .map((f) => f.encodedName)
      .sort()
      .join(', ');
    const icon = hasOneFile ? '📜' : '📦';
    const url = `https://gist.github.com/${login}/${gist.name}`;
    txt += `* ${icon} [${files}](${url})${gist.isPublic ? '' : ' 🔒'}`;
    txt += '\n';
    if (gist.description) {
      txt += `  * \`gist:${gist.name}\` ${gist.description}`;
      txt += '\n';
    }
  });
  if (options.hasFooter) {
    txt += '\n---\n';
    txt += '❤️ [built with gistly](https://github.com/dcai/gistly)';
  }
  return txt;
}
module.exports = {
  makeIndex,
};
