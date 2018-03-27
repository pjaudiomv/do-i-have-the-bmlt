import React, { Component } from 'react';
import { Button, Segment, Header,  Divider } from 'semantic-ui-react';
import InfoLinks from './InfoLinks.js';

class BMLTResult extends Component {
  render() {
    let miles = Math.round(Math.round(this.props.numMiles));
    let milesText = miles === 1 ? `${miles} mile` : `${miles} miles`;

    if (this.props.hasBMLT) {
      return (
        <div>
          <Header as="h3">Yes!</Header>
          <p>The nearest meeting in our database is {milesText} from you, so we think your local service body probably is using the BMLT. If you don't think this is the case, follow the links below to learn more about how to get started!</p>
          <Header as="h3">How do I learn more about the BMLT?</Header>
          <InfoLinks/>
          <Divider hidden/>
          <SearchAgainButton onClick={this.props.searchAgainHandler}/>
          <Divider/>
          <Segment size="mini" secondary basic>Root server: {this.props.rootServerURL}</Segment>
        </div>
      );
    } else {
      return (
        <div>
          <Header as="h3">No ☹</Header>
          <p>The nearest meeting in our database is {milesText} from you, so your local service body probably is not using the BMLT.</p>
          <Header as="h3">I want to use the BMLT. How do I get started?</Header>
          <InfoLinks/>
          <Divider hidden/>
          <SearchAgainButton onClick={this.props.searchAgainHandler}/>
        </div>
      );
    }
  }
}

class SearchAgainButton extends Component {
  render() {
    return <Button fluid onClick={this.props.onClick}>Search for Another Location</Button>;
  };
}

export default BMLTResult;
