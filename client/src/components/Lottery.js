import React, {Component} from 'react';
import '../views/Lottery.css';

export class Lottery extends Component {

    render() {
        return (
            <div className="Lottery">
                <div className="buy-ticket-block">
                    <span className="buy-a-ticket">Buy a ticket</span>
                    <div className="buy-ticket-data1">
                        <span className="estadistic">Lotto cycles</span>
                        <span className="estadistic-data">100</span>
                    </div>
                </div>
            </div>
        )
    }
}