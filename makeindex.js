const { GraphQLClient } = require("graphql-request");
const gql = require("graphql-tag");
const fs = require("fs");

const GITHUB_TOKEN = "";

async function main(token) {
  const endpoint = "https://api.github.com/graphql";
  const query = gql`
    {
      viewer {
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
      authorization: `Bearer ${token}`
    }
  });
  // const data = await graphQLClient.request(query);
  // fs.writeFileSync("./out.json", JSON.stringify(data));

  const data = require("./out.json");

  const gists = data.viewer.gists.edges;

  let txt = "## gist index";
  txt += "\n";
  gists.forEach(item => {
    const gist = item.node;
    if (!gist.isPublic) {
      return;
    }
    const files = gist.files
      .map(f => f.encodedName)
      .sort()
      .join(", ");
    txt += `* [${files}](${gist.url})`;
    txt += "\n";
    if (gist.description) {
      txt += `  * \`gist:${gist.name}\` ${gist.description}`;
      txt += "\n";
    }
  });
  console.info(txt);
}

main(GITHUB_TOKEN).catch(error => console.error(error));
