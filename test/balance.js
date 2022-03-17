const ETHPool = artifacts.require("ETHPool");

contract('ETHPool', (accounts) => {
    const owner = accounts[0];
    it('Get balance', async () => {
        const ETHPoolInstance = await ETHPool.deployed();
        const total = await ETHPoolInstance.total_pool();
        console.log(total.toString());
    });
});