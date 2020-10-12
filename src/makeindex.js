const { GraphQLClient } = require('graphql-request');
const fs = require('fs');

async function makeIndex(token, options) {
  const endpoint = 'https://api.github.com/graphql';
  const query = `
    {
      viewer {
        login
        url
        gists(first: 100, orderBy: { field: CREATED_AT, direction: ASC }) {
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
  // fs.writeFileSync('./out.json', JSON.stringify(data));
  // const data = require('./out.json');
  const login = data.viewer.login;
  const homeUrl = data.viewer.url;

  const gists = data.viewer.gists.edges;

  let txt = `## [@${login}](${homeUrl})'s gist index`;
  txt += '\n';
  gists.forEach((item) => {
    const gist = item.node;
    if (!gist.isPublic) {
      return;
    }
    const files = gist.files
      .map((f) => f.encodedName)
      .sort()
      .join(', ');
    // const url = gist.url;
    const url = `https://gist.github.com/${login}/${gist.name}`;
    txt += `* [${files}](${url})`;
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
  return txt;
}

module.exports = {
  makeIndex,
};
