const { GraphQLClient } = require('graphql-request');
const fs = require('fs');

async function makeIndex(token, options) {
  const endpoint = 'https://api.github.com/graphql';
  const query = `
    {
      viewer {
        login
        url
        gists(first: 100, orderBy: { field: CREATED_AT, direction: ${options.orderDirection} }) {
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

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await graphQLClient.request(query);
  // fs.writeFileSync('/tmp/out.json', JSON.stringify(data));
  const login = data.viewer.login;
  const homeUrl = data.viewer.url;

  const gists = data.viewer.gists.edges;

  let txt = `## 📇 [@${login}](${homeUrl})'s gist index`;
  txt += '\n';
  gists.forEach((item) => {
    const gist = item.node;
    if (!gist.isPublic) {
      return;
    }
    const hasOneFile = gist.files.length === 1;
    const files = gist.files
      .map((f) => f.encodedName)
      .sort()
      .join(', ');
    const icon = hasOneFile ? '📜' : '📦';
    // const url = gist.url;
    const url = `https://gist.github.com/${login}/${gist.name}`;
    txt += `* ${icon} [${files}](${url})`;
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
