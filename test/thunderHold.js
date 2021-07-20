const ThunderHold = artifacts.require("./ThunderHold.sol");
let thunderHold;
// Mock constants
const marketingWallet = "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b";

before(async () => {
    thunderHold = await ThunderHold.new(
        marketingWallet,
        Math.round(new Date().getTime() / 1000));
});

contract('ThunderHold Tests', function (accounts) {

    it("is the marketingWallet deployed correctly", async () => {
        var marketingWalletContract = await thunderHold.marketingWallet.call();

        assert.equal(marketingWalletContract, marketingWallet, "deploy error in marketing wallet");
    });

    it("is the deployed wallet different to marketing wallet", async () => {
        var marketingWalletContract = await thunderHold.marketingWallet.call();
        var deployWallet = accounts[0];

        assert.notEqual(marketingWalletContract, deployWallet, "marketing wallet is deployWallet");
    });

    // it("new deposit in the contract", async () => {
    //     var new_user = accounts[1];
    //     await thunderHold.invest(
    //         "0x94B50Ad34FD502831471B6f5583316820C77B94E", 0,
    //         { from: new_user, value: String(10e16), gas: 500000 } //Deposito 1 ETH
    //     );

    //     var new_user_deposits = await thunderHold.getUserAmountOfDeposits(new_user);
    //     assert.equal(new_user_deposits, 1, "deposit failed");
    // });

    // it("has founding balance", async () => {
    //     var actualBalance = await web3.eth.getBalance(thunderHold.address);
    //     var expectedBalance = await web3.utils.toWei('0.09', 'ether'); // Me queda 0.9 ETH ya descontamos el 10%
    //     assert.deepEqual(actualBalance, expectedBalance, "Balance incorrect!");
    // });

    // it("has a referral user", async () => {
    //     var contract_refferral = await thunderHold.getUserReferrer(accounts[0]);
    //     var referral = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
    //     assert.equal(contract_refferral, referral, "referrals not working");
    // });

    it("new buy lottery ticket", async () => {
        var new_user = accounts[1];
        var ticketsQuantity = 1;
        var valueToWei = web3.utils.toWei(ticketsQuantity.toString(), "ether");

        await thunderHold.lottoDeposit(
            ticketsQuantity,
            { from: new_user, value: valueToWei, gas: 500000 }
        );
        var lottoStats = await thunderHold.getlottoStats();
        var lottoParticipations = lottoStats[6];
        assert.equal(lottoParticipations, 1, "lottery failed!");
    });

});