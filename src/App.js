import React, { Component } from 'react';
import { Divider, Segment, Container, Header, Progress } from 'semantic-ui-react';


class App extends Component {
  render() {
    return (
      <Container>
        <Segment>
          <Header as="h1">Do I have the BMLT?</Header>
          <LocationBox/>
        </Segment>
      </Container>
    );
  }
}

class LocationBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress_total_steps: 4,
      progress_current_step: 0
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation() {
    this.setState({
      progress_text: 'Determining location...',
      progress_current_step: this.state.progress_current_step + 1
    });

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('latitude') && urlParams.has('longitude')) {
      let latitude = urlParams.get('latitude');
      let longitude = urlParams.get('longitude');
      this.getNearestMeeting(latitude, longitude);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          this.getNearestMeeting(latitude, longitude);
        },
        (error) => {
          let message;
          switch(error.code) {
            case error.PERMISSION_DENIED:
              message = "Error: User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Error: Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "Error: The request to get user location timed out.";
              break;
            default:
              message = error.message;
              break;
          }
          this.setState({
            progress_text: message,
          })
        },
        {timeout: 60000}
      );
    }
  }

  getNearestMeeting(latitude, longitude) {
    this.setState({
      progress_text: 'Finding nearest meeting...',
      progress_current_step: this.state.progress_current_step + 1,
      latitude: latitude,
      longitude: longitude
    });

    let url = `https://tomato.na-bmlt.org/main_server/client_interface/json/?switcher=GetSearchResults&lat_val=${latitude}&long_val=${longitude}&geo_width=-1`;
    fetch(url).then(
      (result) => {
        result.json().then(
          (meetings) => {
            let meeting = meetings[0];
            this.getRootServer(meeting);
          }
        );
      },
      (error) => {
        // Error retrieving nearest meeting
        // TODO: Handle errors!
      }
    )
  }

  getRootServer(meeting) {
    this.setState({
      progress_text: 'Retrieving root server url...',
      progress_current_step: this.state.progress_current_step + 1,
      meeting: meeting
    });

    let rootServerId = meeting.root_server_id;
    let url = `https://tomato.na-bmlt.org/rest/v1/rootservers/${rootServerId}/`;
    fetch(url).then(
      (result) => {
        result.json().then(
          (root_server) => {
            this.setState({rootServer: root_server});
          }
        );
      },
      (error) => {
        // Error retrieving root server
        // TODO: Handle errors!
      }
    );
  }

  render() {
    if (this.state.meeting && this.state.rootServer) {
      let infoLinks = (
        <ul>
          <li>Visit the <a href="https://bmlt.magshare.net/" target="_blank" rel="noopener noreferrer">website</a>.</li>
          <li>Join our <a href="https://www.facebook.com/groups/149214049107349/" target="_blank" rel="noopener noreferrer">Facebook Group</a>.</li>
        </ul>
      );

      let miles = Math.round(Math.round(this.state.meeting.distance_in_miles));
      let milesText = miles === 1 ? `${miles} mile` : `${miles} miles`;
      if (miles < 100) {
        return (
          <div>
            <Header as="h3">Yes!</Header>
            <p>The nearest meeting in our database is {milesText} from you, so we think your region probably is using the BMLT. If you don't think this is the case, follow the links below to learn more about how to get started!</p>

            <Header as="h3">How do I learn more about the BMLT?</Header>
            {infoLinks}

            <Divider/>

            <Segment size="mini" secondary basic>Root server: {this.state.rootServer.root_server_url}</Segment>
          </div>
        );
      } else {
        return (
          <div>
            <Header as="h3">No ☹</Header>
            <p>The nearest meeting in our database is {milesText} from you, so your region probably is not using the BMLT.</p>

            <Header as="h3">I want to use the BMLT. How do I get started?</Header>
            {infoLinks}
          </div>
        );
      }
    } else if (this.state.progress_text || this.state.latitude) {
      return (
        <div>
          <Progress
            total={this.state.progress_total_steps}
            value={this.state.progress_current_step}
            label={this.state.progress_text}/>
        </div>
      )
    } else {
      return (
        <div/>
      );
    }
  }
}

export default App;
