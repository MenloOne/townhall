# Message Board

## Set up IFS

1. Install IPFS: `brew install ipfs`
2. Run the daemon: `ipfs daemon`
3. Visit `http://localhost:5001/webui` in the browser (Chrome works, Safari doesn't)

### (Temporarily?) disable CORS

From [js-ipfs-api documentation](https://github.com/ipfs/js-ipfs-api/tree/master/examples/bundle-browserify#setup):

```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

Restart the daemon.

## Install the app

1. Install nvm: `brew install nvm`
2. Clone the repo: `git clone git@github.com:vulcanize/message_board_reactjs.git`
3. Install dependencies: `cd message_board_reactjs && nvm use && yarn install`
4. Run the app: `yarn start`

It should open a browser to `http://localhost:3000/`
