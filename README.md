# Menlo Town Hall

## Development


To develop and run the town hall locally, install the following prerequisites and
dependencies before running the app.

### Prerequisites

#### Brew

We assume `brew` for package management to install `IPFS` and other dependencies:

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#### IPFS

The Town Hall uses [IPFS](https://ipfs.io/) for storage of messages.

Menlo specific setup of IPFS can be installed and configured via:

        yarn run menlo:setup

#### Metamask

Metamask or Mist should be used for interacting with the town hall dapp.

Install Metamask extensions into your browser of choice, Chrome or Brave supported: [http://metamask.io](http://metamask.io)

#### Import development chain account

Import this private key into MetaMask for use with `truffle develop` and `Ganache`:

        388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418


![import MetaMask](https://www.dropbox.com/s/fqpvmut8cppr36o/MetaMaskImport.png?raw=1)

### Install app and dependencies

1. Install nvm and node: `brew install nvm && nvm install`
2. Clone the repo: `git clone git@github.com:vulcanize/message_board_reactjs.git`
3. Install dependencies: `cd message_board_reactjs && nvm use && yarn install`

### Run the application

1. Run a local dev blockchain in a separate window: `yarn run truffle develop`
2. Run IPFS daemon in a separate window: `ipfs daemon`
3. Now, deploy the contracts: `yarn run truffle deploy`
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

For a light, easy to use private chain with a visual and cli interface,
try [Ganache](http://truffleframework.com/ganache/).

You can deploy and test using network ganache:

    yarn run truffle deploy --network ganache

**Note**: Ganache and truffle develop are transitory. Once you shut them down,
you will have to redeploy the contracts and redo any needed transactions.

## Integration

For a persistent local testing environment to test before deploying to
testnet or mainnet, use a Dev chain with Parity or Geth.

You can set the following environment variables in your local `.env` file to
run against a local dev chain if you already have Parity or Geth configured or set
with needed accounts:

    - MENLO_TENET_1: Address for first tenet account.
    - MENLO_TENET_2: Address for second tenet account.
    - MENLO_TENET_3: Address for third tenet account.
    - MENLO_POSTER: Address for the account used to interact with town hall.

### Parity

To run a private dev chain with Parity, first run a dev chain, setup Menlo accounts, and
then deploy contracts.

#### Install Parity

Installing Parity:

        brew install parity


#### Run unlocked dev chain

Assuming a default Parity setup, the initial dev account address is static:

       0x00a329c0648769A73afAc7F9381E08FB43dBEA72

You need to unlock your dev account to be able to run Truffle migrations easily.
The following script runs parity with an unlocked dev account, it will need
to be modified if you've changed the default dev account:

        ./scripts/parity-unlocked-dev.sh

#### Set up Menlo accounts

Create the needed Menlo accounts:

        yarn run truffle menlo:create-integration-accounts

After running the account creation, a set of accounts will be displayed to
add to your `.env` file.

Add MENLO_TENET_1, MENLO_TENET_2, MENLO_TENET_3, and MENLO_POSTER to you `.env`.

#### Deploy Contracts

Once you add the environment variables to your account, rerun parity with the
helper script:

        yarn run menlo:parity-dev-chain

Now deploy the contracts, use the `integration` network defined in `truffle.js` when using parity.

        yarn run truffle deploy --network integration

Your contracts will live between parity dev runs, you can check the contracts addresses to watch with `truffle network`.

Browse [http://localhost:8180](http://localhost:8180) to interact with the Parity wallet.

Parity has a lot of config and features: [Read the effin manual](https://wiki.parity.io/Private-development-chain)

#### Subsequent runs

        yarn run menlo:parity-dev-chain

### Testing

      yarn test


### Deployment

Set the following environment variables:

          1. MENLO_DEPLOYMENT_KEY:
          2. MENLO_DEPLOYMENT_SERVER:

Deploy to server using `shipit`:

      yarn run menlo:deploy

## Staging and Testnet

### Rinkeby & Mist

MetaMask can be used with a Rinkeby account to test against.

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

Run the Town Hall and browse in Mist to [http://localhost:3000](http://localhost:3000).

### Kovan

TBD

        parity --chain kovan

## Production and Mainnet

...
