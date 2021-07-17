const ThunderHold = artifacts.require("./ThunderHold.sol");
let thunderHold;

before( async () => {
    thunderHold = await ThunderHold.new(
        "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
        Math.round(new Date().getTime() / 1000));
    });

contract('ThunderHold Tests', function(accounts){

    it("is the marketingWallet deployed correctly", async() => {
        var marketingWalletContract = await thunderHold.marketingWallet.call();
        var marketingWallet = "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b";

        assert.equal(marketingWalletContract, marketingWallet, "deploy error in marketing wallet");
    });

    it("is the deployed wallet different to marketing wallet", async () => {
        var marketingWalletContract = await thunderHold.marketingWallet.call();
        var deployWallet = accounts[0];

        assert.notEqual(marketingWalletContract, deployWallet, "marketing wallet is deployWallet");
    });

    it("new deposit in the contract", async () => {
        var new_user = accounts[1];
        await thunderHold.invest(
            "0x94B50Ad34FD502831471B6f5583316820C77B94E", 0,
            {from: new_user, value: String(11e16)}
        );

        var new_user_deposits = await thunderHold.getUserAmountOfDeposits(new_user);
        assert.equal(new_user_deposits, 1 , "deposit failed");
    });

    });