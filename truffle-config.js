const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
  networks: {
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          `${process.env.PRIVATE_KEY}`,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
        )
      },
      network_id: 4
    },
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    }
  },
  api_keys: {
    etherscan: process.env.etherscan_key
  },
  plugins: [
    'truffle-plugin-verify'
  ]
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  // enabled: false,
  // host: "127.0.0.1",
  // adapter: {
  //   name: "sqlite",
  //   settings: {
  //     directory: ".db"
  //   }
  // }
  // }
};
