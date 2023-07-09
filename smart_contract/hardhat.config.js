// https://eth-goerli.g.alchemy.com/v2/yu_6cYgPCUczCIh8gdHIGesALtppeLeE

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/yu_6cYgPCUczCIh8gdHIGesALtppeLeE",
      accounts: ["4f99f0fa150016491c51b23fe20711d8bbddb60677228edc3f920879c36c90da"] //[`0x${process.env.PRIVATE_KEY}`]
    },
  },
}