// https://eth-goerli.g.alchemy.com/v2/yu_6cYgPCUczCIh8gdHIGesALtppeLeE

require("@nomiclabs/hardhat-waffle");
const PRIVATE_KEY=import.meta.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/yu_6cYgPCUczCIh8gdHIGesALtppeLeE",
      accounts: [PRIVATE_KEY] //[`0x${process.env.PRIVATE_KEY}`]
    },
  },
}