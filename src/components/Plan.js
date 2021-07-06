import React, { Component } from "react";
import { Button, Header, Input } from "semantic-ui-react";
import { withRouter } from "react-router";

export class Plan extends Component {
  state = {
    invest: 0,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <Header as="h1">Plan 1</Header>

        <Input
          label="Contract Address"
          type="text"
          value={this.state.invest}
          onChange={this.onChange}
        />
        <Button
          primary
          type="submit"
          onClick={this.props.investContract(this.state.invest)}
        >
          Stake TT
        </Button>
      </div>
    );
  }

  onChange(event) {
    this.setState({ invest: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.history.push(`/campaigns/${this.state.invest}`);
  }
}

export default withRouter(Plan);
