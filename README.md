gistly
======

gist cli for gist.github.com, it could build a neat gist list in markdown format, for example:
<https://gist.github.com/dcai/907013>

-   `npm install -g gistly`
-   `gistly init --token 'your-github-token-with-gist-access'`
-   `gistly index` \# prints a markdown format gist index
-   `gistly index --put` \# put the created gist index on linked gist
-   `gistly index --reverse-order` \# reverse the index order
-   `gistly link --gist-id 'gist-id'` \# link to existing index gist
-   `gistly unlink` \# unlink from linked index gist
