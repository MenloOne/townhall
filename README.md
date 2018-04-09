# Menlo Town Hall

## Development

### Prerequisites

#### Brew

We assume `brew` for package management to install `IPFS` and other dependencies:

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#### Metamask

Metamask or Mist should be used for interacting with the townhall dapp.

Install Metamask extensions into browser of choice, Chrome or Brave supported: [http://metamask.io](http://metamask.io)

Import this private key into MetaMask for truffle develop and Ganache:

        388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418

### Install app and dependencies

1. Install nvm and node: `brew install nvm && nvm install`
2. Clone the repo: `git clone git@github.com:vulcanize/message_board_reactjs.git`
3. Install dependencies: `cd message_board_reactjs && nvm use && yarn install`
4. Setup Menlo system dependencies such as IPFS: `yarn run menlo:setup`

### Run the application for development

1. Run a local dev blockchain in a window: `yarn run truffle develop`
2. Deploy the contracts in a separate window: `yarn run truffle deploy`
3. Run IPFS daemon in a separate window: `ipfs daemon`
4. Run the app: `yarn start`

A browser window should open after starting: `http://localhost:3000/`

Ensure you are logged into MetaMask and switch to your imported account.

You can obtain the deployed contracts addresses with `yarn run truffle network`:

        Network: integration (id: 17)
          Forum: 0x84617303947304444ceb641582c024f277bbf4ff
          Lottery: 0x277ad07109fe52a742b808a3e6765ee1ad0e7ad2
          Migrations: 0xa782e56950bdd9f5c3e8693c9d2a78e524e3e612
          Token: 0x01c957395029e9accbcb25a6ab72c618252cacf9


#### Ganache

For a light and easy to use private chain with a visual and cli interface,
try [Ganache](http://truffleframework.com/ganache/).

You can deploy and test using network ganache:

    yarn run truffle deploy --network ganache

Note: Ganache is intended to be used for transitory use, once you shutdown Ganache or truffle develop
you will have to redeploy the contracts and any transactions such as token balances.

## Integration

For a more consistent, local testing environment that is persistent, use a Dev chain with Parity or Geth.

### Parity

To run a private dev chain with Parity, we'll first run a dev chain, setup Menlo needed accounts, and then
run contract deployment.

You need to unlock your dev account to be able to run Truffle migrations easily.
Pass the account address and a password file when running parity, that method is demonstrated below.

        brew install parity
        parity --config dev --unlock 0x00a329c0648769A73afAc7F9381E08FB43dBEA72 --password parity.account --force-ui  --jsonrpc-cors all -lrpc=trace --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts  --no-persistent-txqueue

Setup the needed Menlo accounts:

        yarn run truffle menlo:create-integration-accounts


Use the `integration` network defined in `truffle.js` when using parity.

        yarn run truffle deploy --network integration

Parity has a lot of config and features: [Read the effin manual](https://wiki.parity.io/Private-development-chain)

### Testing

      yarn test


### Deployment

Set the following environment variables:

          1. MENLO_DEPLOYMENT_STAGING_KEY:
          2. MENLO_DEPLOYMENT_STAGING_SERVER:

Deploy to server using `shipit`:

      yarn run shipit staging deploy

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
