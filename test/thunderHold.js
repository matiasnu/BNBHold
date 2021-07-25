const ThunderHold = artifacts.require("./ThunderHold.sol");
let thunderHold;
// Mock constants
const marketingWallet = "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b";
const mockPlan = {
    'time': 7,
    'percent': 200e2,
    'reinvest': 300e2,
};

before(async () => {
    thunderHold = await ThunderHold.new(
        marketingWallet,
        Math.round(new Date().getTime() / 1000));
});

contract('ThunderHold Tests', function (accounts) {
    const new_user = accounts[1];

    it("is the marketingWallet deployed correctly", async () => {
        var marketingWalletContract = await thunderHold.marketingWallet.call();

        assert.equal(marketingWalletContract, marketingWallet, "deploy error in marketing wallet");
    });

    it("is the deployed wallet different to marketing wallet", async () => {
        var marketingWalletContract = await thunderHold.marketingWallet.call();
        var deployWallet = accounts[0];

        assert.notEqual(marketingWalletContract, deployWallet, "marketing wallet is deployWallet");
    });

    it("new deposit in the contract", async () => {
        await thunderHold.invest(
            "0x94B50Ad34FD502831471B6f5583316820C77B94E", 0,
            { from: new_user, value: String(10e16), gas: 500000 } //Deposito 1 ETH
        );

        var new_user_deposits = await thunderHold.getUserAmountOfDeposits(new_user);
        assert.equal(new_user_deposits, 1, "deposit failed");
    });

    it("has founding balance", async () => {
        var actualBalance = await web3.eth.getBalance(thunderHold.address);
        var expectedBalance = await web3.utils.toWei('0.09', 'ether'); // Me queda 0.9 ETH ya descontamos el 10%
        assert.equal(actualBalance, expectedBalance, "Balance incorrect!");
    });

    it("has a referral user", async () => {
        var contract_refferral = await thunderHold.getUserReferrer(accounts[0]);
        var referral = accounts[0];
        assert.equal(contract_refferral, referral, "referrals not working");
    });

    it("new buy lottery ticket", async () => {
        var ticketsQuantity = 1;
        var valueToWei = web3.utils.toWei(ticketsQuantity.toString(), "ether");

        await thunderHold.lottoDeposit(
            ticketsQuantity,
            { from: new_user, value: valueToWei, gas: 500000 }
        );
        var lottoStats = await thunderHold.getlottoStats();
        var lottoParticipations = lottoStats[6];
        assert.equal(lottoParticipations, ticketsQuantity, "lottery failed!");
    });

    it("user has a lottery ticket", async () => {
        userLottoStats = await thunderHold.getUserlottoStats(new_user);
        var userParticipations = userLottoStats[1];
        assert.equal(userParticipations, 1, "user hasn't lottery ticket");
    });

    it ("info about unique plan", async () => {
        var contractPlan = await thunderHold.getPlanInfo(0);
        assert.equal(contractPlan.time, mockPlan.time, "plan created failed!");
        assert.equal(contractPlan.percent, mockPlan.percent, "plan created failed!");
        assert.equal(contractPlan.reinvest, mockPlan.reinvest, "plan created failed!");
    });

    it("lottery user rate bonus", async () => {
        var bonusContract = await thunderHold.getUserLottoRate(new_user);
        var bonus = 5
        assert.equal(bonusContract, bonus, "bonus user loto rate error");
    });

});
