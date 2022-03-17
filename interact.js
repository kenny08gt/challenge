require('dotenv').config();
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`));

const getBalance = async function () {
    web3.eth.getBalance('0x6084867961ccf13a3A3B639271862C59732BB8B4', async (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        let balance = web3.utils.fromWei(result, "ether");
        console.log(balance + " ETH");
    });
};



// Start function
const start = async function (a, b) {
    const result = await getBalance();
}

// Call start
start();
