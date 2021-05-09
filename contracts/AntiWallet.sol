// SPDX-License-Identifier: MIT
/* 
Cosas que tiene que tener:
- Reinversion tradicional fija (30%).
- Retirar cuando uno quiera, si retira pierde el hold bonus.
- Maximo de inversion 
- 1 plan

Ideas:
- Hold bonus combinado con el porcentaje de reinversion (cada dia que pasa dejando la plata sumo interes a mi inversion, si retiro tengo que reinvertir mas)
- Porcentaje de reinversion como tickets de loteria.

Premisas:
- Que sea duradero (minimo de 2 meses)
*/

pragma solidity 0.8.4;

contract AntiWallet {
    using SafeMath for uint256;

    uint256 public constant INVEST_MAX_AMOUNT = 10 ether;
    uint256 public constant INVEST_MIN_AMOUNT = 0.05 ether;

    uint256[] public REFERRAL_PERCENTS = [40e2, 20e2, 10e2, 5e2, 5e2]; //4%,2%,1%,0.5%,0.5%
    uint256 public constant PROJECT_FEE = 50e2;
    uint256 public constant PERCENT_STEP = 10e2;
    uint256 public constant PERCENTS_DIVIDER = 1000e2;
    uint256 public constant TIME_STEP = 1 days; // 1 days

    uint256 public totalStaked;
    uint256 public totalRefBonus;

    struct Plan {
        uint256 time;
        uint256 percent;
        uint256 reinvest;
    }

    Plan[] internal plans;

    struct Deposit {
        uint8 plan;
        uint256 percent;
        uint256 amount;
        uint256 profit;
        uint256 start;
        uint256 finish;
        uint256 reinvest;
    }

    struct User {
        Deposit[] deposits;
        uint256 checkpoint;
        address referrer;
        uint256 referrals;
        uint256 bonus;
        uint256 totalBonus;
        uint256 totalReinvested;
    }

    mapping(address => User) internal users;

    uint256 public startUNIX;

    // Propiedad privada, porque?
    address payable private developerWallet;

    // Evento
    event AliciaEvent(uint256 indexed val1, uint256 indexed val2);

    event Newbie(address user);
    event NewDeposit(
        address indexed user,
        uint8 plan,
        uint256 percent,
        uint256 amount,
        uint256 profit,
        uint256 start,
        uint256 finish
    );
    event Withdrawn(address indexed user, uint256 amount);
    event RefBonus(
        address indexed referrer,
        address indexed referral,
        uint256 indexed level,
        uint256 amount
    );

    constructor(uint256 start) {
        require(start > 0);
        developerWallet = payable(msg.sender);
        startUNIX = start;

        emit AliciaEvent(10, 23);

        // Agregamos solo 1 plan los demas los comentamos
        plans.push(Plan(7, 200e2, 300e2)); // 20% per day for 7 days, 30% reinvest
        plans.push(Plan(15, 180e2, 300e2)); // 18% per day for 15 days, 30% reinvest
        plans.push(Plan(20, 170e2, 200e2)); // 17% per day for 20 days, 20% reinvest
    }

    function alice(uint256 val1, uint256 val2) public returns (uint256) {
        uint256 res1 = val1;
        uint256 res2 = val2;
        emit AliciaEvent(res1, res2);

        return res1 * res2;
    }

    function feepayout(uint256 amt) internal {
        uint256 developerfee = amt.mul(PROJECT_FEE).div(PERCENTS_DIVIDER);
        developerWallet.transfer(developerfee);
    }

    function invest(address referrer, uint8 plan) public payable {
        require(block.timestamp >= startUNIX, "Not Launch");
        require(msg.value >= INVEST_MIN_AMOUNT);
        require(msg.value <= INVEST_MAX_AMOUNT);
        require(plan < 3, "Invalid plan");

        feepayout(msg.value);

        User storage user = users[msg.sender];

        if (user.referrer == address(0)) {
            if (users[referrer].deposits.length > 0 && referrer != msg.sender) {
                user.referrer = referrer;
            } else {
                user.referrer = developerWallet;
            }
            address upline = user.referrer;
            for (uint256 i = 0; i < 5; i++) {
                if (upline != address(0)) {
                    users[upline].referrals = users[upline].referrals.add(1);
                    if (users[upline].referrer == address(0)) {
                        users[upline].referrer = developerWallet;
                    }
                    upline = users[upline].referrer;
                } else break;
            }
        }
        if (user.referrer != address(0)) {
            address upline = user.referrer;
            for (uint256 i = 0; i < 5; i++) {
                if (upline != address(0)) {
                    uint256 amount =
                        msg.value.mul(REFERRAL_PERCENTS[i]).div(
                            PERCENTS_DIVIDER
                        );
                    users[upline].bonus = users[upline].bonus.add(amount);
                    users[upline].totalBonus = users[upline].totalBonus.add(
                        amount
                    );
                    emit RefBonus(upline, msg.sender, i, amount);
                    upline = users[upline].referrer;
                } else break;
            }
        }

        if (user.deposits.length == 0) {
            user.checkpoint = block.timestamp;
            emit Newbie(msg.sender);
        }

        (uint256 percent, uint256 profit, uint256 finish, uint256 reinvest) =
            getResult(plan, msg.value);
        user.deposits.push(
            Deposit(
                plan,
                percent,
                msg.value,
                profit,
                block.timestamp,
                finish,
                reinvest
            )
        );

        totalStaked = totalStaked.add(msg.value);
        emit NewDeposit(
            msg.sender,
            plan,
            percent,
            msg.value,
            profit,
            block.timestamp,
            finish
        );
    }

    function withdraw() external {
        User storage user = users[msg.sender];
        require(
            getTimer(msg.sender) < block.timestamp,
            "withdrawals available once a day"
        );
        uint256 totalAmount;
        uint256 totalReinvestAmount;

        for (uint256 i = 0; i < user.deposits.length; i++) {
            if (user.checkpoint < user.deposits[i].finish) {
                uint256 share =
                    user.deposits[i].amount.mul(user.deposits[i].percent).div(
                        PERCENTS_DIVIDER
                    );
                uint256 from =
                    user.deposits[i].start > user.checkpoint
                        ? user.deposits[i].start
                        : user.checkpoint;
                uint256 to =
                    user.deposits[i].finish < block.timestamp
                        ? user.deposits[i].finish
                        : block.timestamp;
                if (from < to) {
                    uint256 payout = share.mul(to.sub(from)).div(TIME_STEP);
                    uint256 reinvest =
                        payout.mul(user.deposits[i].reinvest).div(
                            PERCENTS_DIVIDER
                        );
                    user.deposits[i].amount = user.deposits[i].amount.add(
                        reinvest
                    );
                    payout = payout.sub(reinvest);
                    totalAmount = totalAmount.add(payout);
                    totalReinvestAmount = totalReinvestAmount.add(reinvest);
                }
            }
        }

        uint256 referralBonus = getUserReferralBonus(msg.sender);
        if (referralBonus > 0) {
            user.bonus = 0;
            totalAmount = totalAmount.add(referralBonus);
        }

        user.totalReinvested = user.totalReinvested.add(totalReinvestAmount);
        require(totalAmount > 0, "User has no dividends");
        uint256 contractBalance = address(this).balance;
        if (contractBalance < totalAmount) {
            totalAmount = contractBalance;
        }

        user.checkpoint = block.timestamp;

        (bool success, ) = msg.sender.call{value: totalAmount}("");
        require(success, "Transfer failed.");

        emit Withdrawn(msg.sender, totalAmount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlanInfo(uint8 plan)
        public
        view
        returns (
            uint256 time,
            uint256 percent,
            uint256 reinvest
        )
    {
        time = plans[plan].time;
        percent = plans[plan].percent;
        reinvest = plans[plan].reinvest;
    }

    function getPercent(uint8 plan) public view returns (uint256) {}

    function getReinvest(uint8 plan) public view returns (uint256 reinvest) {
        uint256 time = block.timestamp.sub(startUNIX).div(TIME_STEP);
        if (plan == 0) {
            if (time > 25) {
                return 0;
            } else {
                return plans[plan].reinvest.sub(time.mul(20e2)); //reinvest decreases every day by 2%
            }
        }
        if (plan == 1) {
            if (time > 30) {
                return 0;
            } else {
                return plans[plan].reinvest.sub(time.mul(10e2)); //reinvest decreases every day by 1%
            }
        }

        if (plan == 2) {
            if (time > 40) {
                return 0;
            } else {
                return plans[plan].reinvest.sub(time.mul(5e2)); //reinvest decreases every day by 0.5%
            }
        }
    }

    function getTimer(address userAddress) public view returns (uint256) {
        return getUserCheckpoint(userAddress).add(TIME_STEP);
    }

    function getResult(uint8 plan, uint256 deposit)
        public
        view
        returns (
            uint256 percent,
            uint256 profit,
            uint256 finish,
            uint256 reinvest
        )
    {
        percent = getPercent(plan);
        reinvest = getReinvest(plan);

        profit = deposit.mul(percent).div(PERCENTS_DIVIDER).mul(
            plans[plan].time
        );

        finish = block.timestamp.add(plans[plan].time.mul(TIME_STEP));
    }

    function getUserDividends(address userAddress)
        public
        view
        returns (uint256)
    {
        User storage user = users[userAddress];

        uint256 totalAmount;

        for (uint256 i = 0; i < user.deposits.length; i++) {
            if (user.checkpoint < user.deposits[i].finish) {
                uint256 share =
                    user.deposits[i].amount.mul(user.deposits[i].percent).div(
                        PERCENTS_DIVIDER
                    );
                uint256 from =
                    user.deposits[i].start > user.checkpoint
                        ? user.deposits[i].start
                        : user.checkpoint;
                uint256 to =
                    user.deposits[i].finish < block.timestamp
                        ? user.deposits[i].finish
                        : block.timestamp;
                if (from < to) {
                    totalAmount = totalAmount.add(
                        share.mul(to.sub(from)).div(TIME_STEP)
                    );
                }
            }
        }

        return totalAmount;
    }

    function getUserCheckpoint(address userAddress)
        public
        view
        returns (uint256)
    {
        return users[userAddress].checkpoint;
    }

    function getUserReinvestedAmount(address userAddress)
        public
        view
        returns (uint256)
    {
        return users[userAddress].totalReinvested;
    }

    function getUserReferrer(address userAddress)
        public
        view
        returns (address)
    {
        return users[userAddress].referrer;
    }

    function getUserDownlineCount(address userAddress)
        public
        view
        returns (uint256)
    {
        return users[userAddress].referrals;
    }

    function getUserReferralBonus(address userAddress)
        public
        view
        returns (uint256)
    {
        return users[userAddress].bonus;
    }

    function getUserReferralTotalBonus(address userAddress)
        public
        view
        returns (uint256)
    {
        return users[userAddress].totalBonus;
    }

    function getUserReferralWithdrawn(address userAddress)
        public
        view
        returns (uint256)
    {
        return users[userAddress].totalBonus.sub(users[userAddress].bonus);
    }

    function getUserAvailable(address userAddress)
        public
        view
        returns (uint256)
    {
        return
            getUserReferralBonus(userAddress).add(
                getUserDividends(userAddress)
            );
    }

    function getUserAmountOfDeposits(address userAddress)
        public
        view
        returns (uint256)
    {
        return users[userAddress].deposits.length;
    }

    function getUserTotalDeposits(address userAddress)
        public
        view
        returns (uint256 amount)
    {
        for (uint256 i = 0; i < users[userAddress].deposits.length; i++) {
            amount = amount.add(users[userAddress].deposits[i].amount);
        }
    }

    function getUserDepositInfo(address userAddress, uint256 index)
        public
        view
        returns (
            uint8 plan,
            uint256 percent,
            uint256 amount,
            uint256 profit,
            uint256 start,
            uint256 finish,
            uint256 reinvest
        )
    {
        User storage user = users[userAddress];

        plan = user.deposits[index].plan;
        percent = user.deposits[index].percent;
        amount = user.deposits[index].amount;
        profit = user.deposits[index].profit;
        start = user.deposits[index].start;
        finish = user.deposits[index].finish;
        reinvest = user.deposits[index].reinvest;
    }

    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function minZero(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a > b) {
            return a - b;
        } else {
            return 0;
        }
    }

    function maxVal(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }

    function minVal(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a > b) {
            return b;
        } else {
            return a;
        }
    }
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }
}
