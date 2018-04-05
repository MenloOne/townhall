module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      from: '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2',
      network_id: "*"
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
    integration: {
      host: "127.0.0.1",
      port: 8545,
      gas: 4700000,
      gasPrice: 0,
      network_id: 17
    },
    rinkeby: {
      host: "127.0.0.1",
      port: 8545,
      gas: 4612388,
      network_id: 4,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
}
