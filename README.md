# Message Board

## Development

### Set up IPFS

1. Install IPFS: `brew install ipfs`
2. Run the daemon: `ipfs daemon`
3. Visit `http://localhost:5001/webui` in the browser (Chrome works, Safari doesn't)

#### Add the Websocket listener

Add the following entry to your `Swarm` array in `~.ipfs/config`: `/ip4/127.0.0.1/tcp/9999/ws`.
Now, it should look like this:

```
  "Addresses": {
    "API": "/ip4/127.0.0.1/tcp/5001",
    "Announce": [],
    "Gateway": "/ip4/127.0.0.1/tcp/8080",
    "NoAnnounce": [],
    "Swarm": [
      "/ip4/0.0.0.0/tcp/4001",
      "/ip6/::/tcp/4001",
      "/ip4/127.0.0.1/tcp/9999/ws"
    ]
  }
```

Restart the ipfs daemon

#### (Temporarily?) disable CORS

From [js-ipfs-api documentation](https://github.com/ipfs/js-ipfs-api/tree/master/examples/bundle-browserify#setup):

```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

Restart the daemon.

### Set up Ethereum locally

#### Ganache

For a light and easy to use private chain, try [Ganache](http://truffleframework.com/ganache/).

Note: Ganache is intended to be used for transitory use, once you shutdown Ganache you will
have to redeploy the contracts and any transactions such as token balances.

For a more consistent, local testing environment, use Parity.

#### Parity

Another option, which also enables interacting with the rest of Ethereum, is
to run a private dev chain with Parity, install and run a private dev chain:

        brew install parity
        parity --config dev

Parity has a lot of config and features: [Read the effin manual](https://wiki.parity.io/Private-development-chain)

### Install the app

1. Install nvm and node: `brew install nvm && nvm install`
2. Clone the repo: `git clone git@github.com:vulcanize/message_board_reactjs.git`
3. Install dependencies: `cd message_board_reactjs && nvm use && yarn install`
4. Run Ganache: GUI or 'ganache-cli -p 7545'
4. Deploy the contracts: `yarn run truffle deploy`
5. Run the app: `yarn start`

It should open a browser to `http://localhost:3000/`

### Testing

...

## Staging and Testnet

### Rinkeby

  * AppTokenMock: [0xc572a47400dd961cae55105b45a9f50c855d1157](https://rinkeby.etherscan.io/address/0xc572a47400dd961cae55105b45a9f50c855d1157)
  * Forum: [0x987b79850cac18f37707460e45954c457609e237](https://rinkeby.etherscan.io/address/0x987b79850cac18f37707460e45954c457609e237)
  * Lottery: [0xc055284e9b03bb134ac59153e271706301bba969](https://rinkeby.etherscan.io/address/0xc055284e9b03bb134ac59153e271706301bba969)

### Kovan

...


## Production and Mainnet

...

