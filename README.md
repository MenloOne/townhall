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
to run a private dev chain with Parity.

You need to unlock your account to be able to run Truffle migrations easily.
One method is to pass the account address and a password file when running parity,
that method is demonstrated below.

You can also call the `personal_unlockAccount` rpc method.

        brew install parity
        parity --config dev --unlock 0x00a329c0648769A73afAc7F9381E08FB43dBEA72 --password parity.account --force-ui  --jsonrpc-cors all -lrpc=trace --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts  --no-persistent-txqueue

Use the `integration` network defined in `truffle.js` when using parity.

        yarn run truffle deploy --network integration

Parity has a lot of config and features: [Read the effin manual](https://wiki.parity.io/Private-development-chain)

### Install the app

1. Install nvm and node: `brew install nvm && nvm install`
2. Clone the repo: `git clone git@github.com:vulcanize/message_board_reactjs.git`
3. Install dependencies: `cd message_board_reactjs && nvm use && yarn install`
4. Run Ganache: GUI or `ganache-cli -p 7545`
4. Deploy the contracts: `yarn run truffle deploy`
5. Run the app: `yarn start`

It should open a browser to `http://localhost:3000/`

You can obtain the deployed contracts addresses with `yarn run truffle network`:

        Network: integration (id: 17)
          Forum: 0x84617303947304444ceb641582c024f277bbf4ff
          Lottery: 0x277ad07109fe52a742b808a3e6765ee1ad0e7ad2
          Migrations: 0xa782e56950bdd9f5c3e8693c9d2a78e524e3e612
          Token: 0x01c957395029e9accbcb25a6ab72c618252cacf9


### Testing

...

## Staging and Testnet

### Rinkeby & Mist

The [Mist](https://github.com/ethereum/mist/releases) browser can be used to test the Rinkeby testnet.

Mist uses [Geth](https://github.com/ethereum/go-ethereum) underneath:

        brew install geth

Run Geth against Rinkeby with the Apis needed by Truffle:

        geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --rpccorsdomain http://localhost:3000

Now, run Mist against your local instance of Geth:

        /Applications/Mist.app/Contents/MacOS/Mist --rpc http://127.0.0.1:8545

**Wait for the blocks to sync** , (go for a walk and enjoy the sunshine).

After the blocks sycn, note your account hash in the Mist Wallet, you'll need it later.

Close Mist, Stop Geth.

Now, run Geth with the account you noted above unlocked:

        geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="0x4B71d4020a69902E6cB1d9a387a03cF0a839d33b" --rpccorsdomain http://localhost:3000

Run Mist again:

        /Applications/Mist.app/Contents/MacOS/Mist --rpc http://127.0.0.1:8545

Now you are ready to deploy contracts and test:

        yarn run truffle deploy --network rinkeby

Go to the faucet to get some free Ether: [Rinkeby Faucet](https://faucet.rinkeby.io/)

Give your Mist account some TK/MET tokens:

        yarn run truffle console --network rinkeby
        Token.deployed().then(i => i.transfer('0x00000000000', 100000) )

Run the Message Board front-end and browse to [http://localhost:3000](http://localhost:3000)
(this should be a staging server eventually) in Mist.


### Kovan

TBD

        parity --chain kovan

## Production and Mainnet

...
