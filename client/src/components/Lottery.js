import React, { Component } from "react";
import "../views/Lottery.css";

// Import images for styles
import lotteryBonusImg from "../views/images/lottery-bonus.png";
import totalProfitsImg from "../views/images/total-profits-lottery.png";
import participationsImg from "../views/images/participations-lottery.png";

import rule1Img from "../views/images/lottery-rule1.png";
import rule2Img from "../views/images/lottery-rule2.png";
import rule3Img from "../views/images/lottery-rule3.png";
import rule4Img from "../views/images/lottery-rule4.png";

import lotteryAward1 from "../views/images/lottery-award1.png";
import lotteryAward2 from "../views/images/lottery-award2.png";
import lotteryAward3 from "../views/images/lottery-award3.png";
import lotteryAward4 from "../views/images/lottery-award4.png";
import lotteryAward5 from "../views/images/lottery-award5.png";
import lotteryAward6 from "../views/images/lottery-cumulative-pool.png";
import lotteryAward7 from "../views/images/lottery-support.png";

import lotteryWinnersAddress from "../views/images/contract-address.png";
import swal from 'sweetalert'

export class Lottery extends Component {
  state = {
    tickets: 0,
    web3: this.props.web3,
    thunderContract: this.props.thunderContract,
    accounts: this.props.accounts,
  };

  componentDidMount = async () => {
    try {
      this.onChange = this.onChange.bind(this);
      this.getLotteryStatistics();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  buyTicket = async () => {
    const { web3, thunderContract, accounts, tickets } = this.state;

    try{
      console.log("Account usada para comprar tickets: ", accounts[0]);
      console.log("Tickets comprados ", tickets);

      if(tickets <= 0){
        const e = "The number of tickets must be positive and greater than zero";
        throw e;
        //window.location.reload(false);
      }

      const valueToWei = web3.utils.toWei(tickets, "ether");
      console.log("valueToWei:", valueToWei);

      await thunderContract.methods
        .lottoDeposit(tickets)
        .send({
          from: accounts[0],
          value: valueToWei,
          gas: 500000,
        });

      // Actualizo state de la lotery
      this.getLotteryStatistics();
    } catch (error) {
      swal("Oops!",error,"error");
    }
  };

  getLotteryStatistics = async () => {
    const { accounts, thunderContract, web3 } = this.state;

    let userLottoStats = await thunderContract.methods
      .getUserlottoStats(accounts[0])
      .call();
    let userLottoBonus = userLottoStats[0];
    let userLottoParticipations = userLottoStats[1];
    let userLottoLimit = userLottoStats[2];
    if (userLottoStats) {
        console.log("getUserlottoStats:", userLottoStats);
    }

    let getLotttoStats = await thunderContract.methods
      .getlottoStats()
      .call();
    if (getLotttoStats) {
       console.log("getLotttoStats:", getLotttoStats);
    }

    this.setState({
      userLottoBonus: userLottoBonus,
      userLottoParticipations: userLottoParticipations,
      userLottoLimit: userLottoLimit,
      lottoLastWin1a: this.parsedAddress(getLotttoStats[0]),
      lottoLastWin2a: this.parsedAddress(getLotttoStats[1]),
      lottoLastWin3a: this.parsedAddress(getLotttoStats[2]),
      lottoLastWin4a: this.parsedAddress(getLotttoStats[3]),
      lottoLastWin5a: this.parsedAddress(getLotttoStats[4]),
      lottoCycles: getLotttoStats[5],
      lottoCurrentTicketsCount: getLotttoStats[6],
      lottoTotalTicketsCount: getLotttoStats[7],
      LOTTO_TICKET_LIMIT: getLotttoStats[8],
      LOTTOTICKET: getLotttoStats[9],
      lottoCurrentPot: getLotttoStats[10],
      lottoBag: getLotttoStats[11],
      remainingTickets: getLotttoStats[8] - getLotttoStats[6] 
    });
  };

  parsedAddress = (address) =>{
    return (address.substring(-1, 20) + "..." + address.substring(34));
  }

  render() {
    return (
      <div className="Lottery">
        <div className="buy-ticket-block">
          <span className="lottery-tittle">Buy a ticket</span>
          <div className="buy-ticket-data1">
            <span className="estadistic">Lotto cycles</span>
            <span className="estadistic-data">{this.state.lottoCycles}</span>
          </div>
          <div className="buy-ticket-data2">
            <span className="estadistic">Accumulated pool</span>
            <span className="estadistic-data">038989 TT</span>
          </div>
          <div className="buy-ticket-data3">
            <span className="estadistic">Current accumulated</span>
            <span className="estadistic-data">38989 TT</span>
          </div>
          <div className="buy-ticket-data4">
            <span className="estadistic">Remaining tickets</span>
            <span className="estadistic-data">{this.state.remainingTickets}</span>
          </div>
          <span className="buy-ticket-amount">Tickets to buy</span>
          <input
            className="input-value-buy"
            type="number"
            value={this.state.tickets}
            onChange={this.onChange}
          />
          <button
            className="buy-ticket-button"
            type="button"
            onClick={this.buyTicket}
          >
            <span className="buy-ticket-snap">Buy</span>
          </button>
        </div>

        <div className="lottery-bonus-block">
          <img className="lottery-bonus-logo" src={lotteryBonusImg}></img>
          <span className="lottery-bonus-span">Lottery bonus</span>
          <span className="lottery-bonus-data">{this.state.userLottoBonus}</span>
        </div>

        <div className="total-profits-block">
          <img className="lottery-bonus-logo" src={totalProfitsImg}></img>
          <span className="lottery-bonus-span">Total profits</span>
          <span className="lottery-bonus-data">xxxx</span>
        </div>

        <div className="participations-block">
          <img className="lottery-bonus-logo" src={participationsImg}></img>
          <span className="lottery-bonus-span">Participations</span>
          <span className="lottery-bonus-data">{this.state.userLottoParticipations}</span>
        </div>

        <div className="rules-block">
          <span className="lottery-tittle">Rules</span>
          <div>
            <img className="lottery-rule1-img" src={rule1Img}></img>
            <span className="lottery-rule1-span">Ticket value:</span>
            <span className="lottery-rule1-data">100 TT</span>
          </div>
          <div>
            <img className="lottery-rule2-img" src={rule2Img}></img>
            <span className="lottery-rule2-span">
              One cycle is executed when 50 tickets sold are reached
            </span>
          </div>
          <div>
            <img className="lottery-rule3-img" src={rule3Img}></img>
            <span className="lottery-rule3-span">
              Maximun purchase per cycle
            </span>
            <span className="lottery-rule3-data">100 Tickets</span>
          </div>
          <div>
            <img className="lottery-rule4-img" src={rule4Img}></img>
            <span className="lottery-rule4-span">Bonus lottery:</span>
            <span className="lottery-rule4-data">
              + 0.005% is credited to all plans for each ticket purchased
            </span>
          </div>
        </div>

        <div className="awards-block">
          <span className="lottery-tittle">Awards</span>
          <div className="lottery-awards1">
            <img className="lottery-awards-img" src={lotteryAward1}></img>
            <span className="lottery-awards-span">First Prize 25%</span>
          </div>
          <div className="lottery-awards2">
            <img className="lottery-awards-img" src={lotteryAward2}></img>
            <span className="lottery-awards-span">Second Prize 15%</span>
          </div>
          <div className="lottery-awards3">
            <img className="lottery-awards-img" src={lotteryAward3}></img>
            <span className="lottery-awards-span">Third Prize 10%</span>
          </div>
          <div className="lottery-awards4">
            <img className="lottery-awards-img" src={lotteryAward4}></img>
            <span className="lottery-awards-span">Fourth Prize 5%</span>
          </div>
          <div className="lottery-awards5">
            <img className="lottery-awards-img" src={lotteryAward5}></img>
            <span className="lottery-awards-span">Fifth Prize 2%</span>
          </div>
          <div className="lottery-awards6">
            <img className="lottery-awards2-img" src={lotteryAward6}></img>
            <span className="lottery-awards-span">Cumulative pool: 12%</span>
          </div>
          <div className="lottery-awards7">
            <img className="lottery-awards2-img" src={lotteryAward7}></img>
            <span className="lottery-awards-span">
              Support to the balance sheet: 31%
            </span>
          </div>
        </div>

        <div className="winners-block">
          <span className="lottery-tittle">Winners</span>
          <div className="lottery-winners1">
            <div className="lottery-winners-background"></div>
            <div className="lottery-winners-background-yellow">
              <span className="lottery-winners-position">1</span>
            </div>
            <span className="lottery-winners-quantity">83498 TT</span>
            <span className="lottery-winners-address">
              {this.state.lottoLastWin1a}
            </span>
            <img
              className="lottery-winners-img"
              src={lotteryWinnersAddress}
            ></img>
          </div>
          <div className="lottery-winners2">
            <div className="lottery-winners-background"></div>
            <div className="lottery-winners-background-yellow">
              <span className="lottery-winners-position">2</span>
            </div>
            <span className="lottery-winners-quantity">83498 TT</span>
            <span className="lottery-winners-address">
              {this.state.lottoLastWin2a}
            </span>
            <img
              className="lottery-winners-img"
              src={lotteryWinnersAddress}
            ></img>
          </div>
          <div className="lottery-winners3">
            <div className="lottery-winners-background"></div>
            <div className="lottery-winners-background-yellow">
              <span className="lottery-winners-position">3</span>
            </div>
            <span className="lottery-winners-quantity">83498 TT</span>
            <span className="lottery-winners-address">
              {this.state.lottoLastWin3a}
            </span>
            <img
              className="lottery-winners-img"
              src={lotteryWinnersAddress}
            ></img>
          </div>
          <div className="lottery-winners4">
            <div className="lottery-winners-background"></div>
            <div className="lottery-winners-background-yellow">
              <span className="lottery-winners-position">4</span>
            </div>
            <span className="lottery-winners-quantity">83498 TT</span>
            <span className="lottery-winners-address">
              {this.state.lottoLastWin4a}
            </span>
            <img
              className="lottery-winners-img"
              src={lotteryWinnersAddress}
            ></img>
          </div>
          <div className="lottery-winners5">
            <div className="lottery-winners-background"></div>
            <div className="lottery-winners-background-yellow">
              <span className="lottery-winners-position">5</span>
            </div>
            <span className="lottery-winners-quantity">83498 TT</span>
            <span className="lottery-winners-address">
              {this.state.lottoLastWin5a}
            </span>
            <img
              className="lottery-winners-img"
              src={lotteryWinnersAddress}
            ></img>
          </div>
        </div>
      </div>
    );
  }

  onChange(event) {
    this.setState({ tickets: event.target.value });
  }
}
