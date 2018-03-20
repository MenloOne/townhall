# Message Board

## Set up IFS

1. Install IPFS: `brew install ipfs`
2. Run the daemon: `ipfs daemon`
3. Visit `http://localhost:5001/webui` in the browser (Chrome works, Safari doesn't)

### Add the Websocket listener

Add the following entry to your `Swarm` array in `~.ipfs/config`: `/ip4/127.0.0.1/tcp/9999/ws`.
Now, it should look like this:

```
"Addresses": {
  "Swarm": [
    "/ip4/0.0.0.0/tcp/4002",
    "/ip4/127.0.0.1/tcp/9999/ws"
  ],
  "API": "/ip4/127.0.0.1/tcp/5002",
  "Gateway": "/ip4/127.0.0.1/tcp/9090"
}
```

Restart the ipfs daemon

### (Temporarily?) disable CORS

From [js-ipfs-api documentation](https://github.com/ipfs/js-ipfs-api/tree/master/examples/bundle-browserify#setup):

```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

Restart the daemon.

## Install the app

1. Install nvm and node: `brew install nvm && nvm install`
2. Clone the repo: `git clone git@github.com:vulcanize/message_board_reactjs.git`
3. Install dependencies: `cd message_board_reactjs && nvm use && yarn install`
4. Run the app: `yarn start`

It should open a browser to `http://localhost:3000/`
