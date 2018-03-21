module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    integration: {
      host: "127.0.0.1",
      port: 8545,
      gas: 4700000,
      gasPrice: 0,
      network_id: "17"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
}
