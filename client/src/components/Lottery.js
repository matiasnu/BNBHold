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

export class Lottery extends Component {
  state = {
    tickets: 0,
  };

  buyTicket = async () => {
    const { tickets } = this.state;

    console.log("Tickets comprados ", tickets);
  };

  render() {
    return (
      <div className="Lottery">
        <div className="buy-ticket-block">
          <span className="lottery-tittle">Buy a ticket</span>
          <div className="buy-ticket-data1">
            <span className="estadistic">Lotto cycles</span>
            <span className="estadistic-data">100</span>
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
            <span className="estadistic-data">10</span>
          </div>
          <span className="buy-ticket-amount">Enter amount</span>
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
          <span className="lottery-bonus-data">xxxx</span>
        </div>

        <div className="total-profits-block">
          <img className="lottery-bonus-logo" src={totalProfitsImg}></img>
          <span className="lottery-bonus-span">Total profits</span>
          <span className="lottery-bonus-data">xxxx</span>
        </div>

        <div className="participations-block">
          <img className="lottery-bonus-logo" src={participationsImg}></img>
          <span className="lottery-bonus-span">Participations</span>
          <span className="lottery-bonus-data">xxxx</span>
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
              0X6738D62FFD3756767436...E16E3
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
              0X6738D62FFD3756767436...E16E3
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
              0X6738D62FFD3756767436...E16E3
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
              0X6738D62FFD3756767436...E16E3
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
              0X6738D62FFD3756767436...E16E3
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
