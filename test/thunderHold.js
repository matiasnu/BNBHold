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

    });