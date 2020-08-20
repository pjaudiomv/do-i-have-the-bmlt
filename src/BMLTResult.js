import React, { Component } from 'react';
import { Button, Divider, Header, Segment } from 'semantic-ui-react';
import CopyURLInput from './CopyURLInput.js'

class BMLTResult extends Component {
  render() {
    let km = Math.round(Math.round(this.props.kilometers));
    let miles = Math.round(Math.round(this.props.miles));
    let distanceText = `${miles}mi (${km}km)`;

    let getAnswer = () => {
      if (this.props.hasBMLT) {
        return 'Yes!';
      }
      return 'No ☹';
    };

    let getContent = () => {
      if (this.props.hasBMLT) {
        return `The nearest meeting in our database is ${distanceText} from you, so we think your local service body probably is using the BMLT. If you don't think this is the case, follow the links below to learn more about how to get started!`;
      }
      return `The nearest meeting in our database is ${distanceText} from you, so your local service body probably is not using the BMLT.`;
    };

    let getLearnMoreText = () => {
      if (this.props.hasBMLT) {
        return 'How do I learn more about the BMLT?';
      }
      return 'I want to use the BMLT. How do I get started?';
    };

    let getRootServerComponent = () => {
      if (this.props.hasBMLT) {
        return (
          <div>
            <Divider/>
            <Segment size="mini" secondary basic>Root server: {this.props.rootServerURL}</Segment>
          </div>
        )
      }
      return <div/>;
    };

    return (
      <div>
        <Header as="h3">{getAnswer()}</Header>
        <p>{getContent()}</p>
        <Header as="h3">{getLearnMoreText()}</Header>
        <ul>
          <li>Visit the <a href="https://bmlt.app/" target="_blank" rel="noopener noreferrer">website</a>.</li>
          <li>Join our <a href="https://www.facebook.com/groups/149214049107349/" target="_blank" rel="noopener noreferrer">Facebook Group</a>.</li>
        </ul>
        <Header as="h3">Share This Search</Header>
        <CopyURLInput latitude={this.props.latitude} longitude={this.props.longitude} />
        <Divider hidden/>
        <Button fluid onClick={this.props.searchAgainHandler}>Search for Another Location</Button>
        {getRootServerComponent()}
      </div>
    );
  }
}

export default BMLTResult;
