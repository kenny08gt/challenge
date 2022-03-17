const ETHPool = artifacts.require("ETHPool");

contract('ETHPool', (accounts) => {
    const owner = accounts[0];
    it('Can deposit only user', async () => {
        const user = accounts[1];
        const ETHPoolInstance = await ETHPool.deployed();
        // const contract = await ETHPoolInstance.contract;
        await ETHPoolInstance.addUserRole(user, { from: owner });
        await ETHPoolInstance.deposit({ from: user, value: web3.utils.toWei(String(0.20), 'ether') });
        const balance = await ETHPoolInstance.balance.call({ from: user });
        // console.log(BigInt(balance));
        assert.equal(BigInt(balance), BigInt(web3.utils.toWei(String(0.20), 'ether')));
        await ETHPoolInstance.withdraw({ from: user });
    });

    it('Admin cannot deposit, only user', async () => {
        const user = accounts[1];
        const ETHPoolInstance = await ETHPool.deployed();
        try {
            await ETHPoolInstance.addUserRole(user, { from: owner });
            await ETHPoolInstance.deposit({ from: admin, value: web3.utils.toWei(String(0.15), 'ether') });
            assert.equal(true, false);
        } catch (error) {
            assert.equal(true, true);
        }
    });

    it('Team deposit reward', async () => {
        const ETHPoolInstance = await ETHPool.deployed();
        try {
            await ETHPoolInstance.depositReward({ from: owner, value: web3.utils.toWei(String(1), 'ether') });
            assert.equal(true, false);
        } catch (error) {
            assert.equal(true, true);
        }
        const balance = await ETHPoolInstance.balanceReward.call({ from: owner });
        // console.log(BigInt(balance));
        assert.equal(BigInt(balance), BigInt(web3.utils.toWei(String(0), 'ether')));
        // await ETHPoolInstance.withdraw({ from: user });
    });

    it('User cannot deposit reward', async () => {
        const user = accounts[1];
        const ETHPoolInstance = await ETHPool.deployed();
        try {
            await ETHPoolInstance.depositReward({ from: user, value: web3.utils.toWei(String(1), 'ether') });
            assert.equal(true, false);
        } catch (error) {
            assert.equal(true, true);
        }
    });

    it('Can withdraw reward', async () => {
        const user = accounts[1];
        const ETHPoolInstance = await ETHPool.deployed();
        await ETHPoolInstance.addUserRole(user, { from: owner });
        await ETHPoolInstance.deposit({ from: user, value: web3.utils.toWei(String(0.2), 'ether') });
        let balance = await ETHPoolInstance.balance.call({ from: user });
        assert.equal(BigInt(balance), BigInt(web3.utils.toWei(String(0.2), 'ether')));


        const user2 = accounts[2];
        await ETHPoolInstance.addUserRole(user2, { from: owner });
        await ETHPoolInstance.deposit({ from: user2, value: web3.utils.toWei(String(0.30), 'ether') });
        let balance2 = await ETHPoolInstance.balance.call({ from: user2 });
        assert.equal(BigInt(balance2), BigInt(web3.utils.toWei(String(0.30), 'ether')));


        await ETHPoolInstance.depositReward({ from: owner, value: web3.utils.toWei(String(1), 'ether') });
        let balance3 = await ETHPoolInstance.balanceReward.call({ from: owner });
        assert.equal(BigInt(balance3), BigInt(web3.utils.toWei(String(0), 'ether')));

        balance = 0;
        balance = await ETHPoolInstance.balance.call({ from: user });
        // console.log(BigInt(balance));
        assert.equal(BigInt(balance), BigInt(web3.utils.toWei(String(0.6), 'ether')), "User 1 should have 0.7 ether");
        await ETHPoolInstance.withdraw({ from: user });

        balance2 = 0;
        balance2 = await ETHPoolInstance.balance.call({ from: user2 });
        // console.log(BigInt(balance2));
        assert.equal(BigInt(balance2), BigInt(web3.utils.toWei(String(0.9), 'ether')), "User 2, shoudl have 0.9 ether");
        await ETHPoolInstance.withdraw({ from: user2 });
    });

    it('Can withdraw reward case2', async () => {
        const user = accounts[1];
        const ETHPoolInstance = await ETHPool.deployed();
        await ETHPoolInstance.addUserRole(user, { from: owner });
        await ETHPoolInstance.deposit({ from: user, value: web3.utils.toWei(String(0.2), 'ether') });
        let balance = await ETHPoolInstance.balance.call({ from: user });
        assert.equal(BigInt(balance), BigInt(web3.utils.toWei(String(0.2), 'ether')));


        await ETHPoolInstance.depositReward({ from: owner, value: web3.utils.toWei(String(1), 'ether') });
        let balance3 = await ETHPoolInstance.balanceReward.call({ from: owner });
        assert.equal(BigInt(balance3), BigInt(web3.utils.toWei(String(0), 'ether')));

        const user2 = accounts[2];
        await ETHPoolInstance.addUserRole(user2, { from: owner });
        await ETHPoolInstance.deposit({ from: user2, value: web3.utils.toWei(String(0.30), 'ether') });
        let balance2 = await ETHPoolInstance.balance.call({ from: user2 });
        assert.equal(BigInt(balance2), BigInt(web3.utils.toWei(String(0.30), 'ether')));



        balance = 0;
        balance = await ETHPoolInstance.balance.call({ from: user });
        // console.log(BigInt(balance));
        assert.equal(BigInt(balance), BigInt(web3.utils.toWei(String(1.2), 'ether')), "User 1 should have 0.7 ether");
        await ETHPoolInstance.withdraw({ from: user });

        balance2 = 0;
        balance2 = await ETHPoolInstance.balance.call({ from: user2 });
        // console.log(BigInt(balance2));
        assert.equal(BigInt(balance2), BigInt(web3.utils.toWei(String(0.3), 'ether')), "User 2, shoudl have 0.9 ether");
        await ETHPoolInstance.withdraw({ from: user2 });
    });
});