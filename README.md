# gistly

gist cli for gist.github.com, it could build a neat gist list in markdown format, for example: https://gist.github.com/dcai/907013

- npm i -g gistly
- gist init --token 'your github token with gist access'
- gist index # this prints a markdown format gist index
- gist index --put # put the created gist index on the server
- gist link --gist-id 'gist id' # link to existing index gist
- gist unlink # unlink from linked index gist
