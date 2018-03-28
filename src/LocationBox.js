import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';
import GetLocationModal from './GetLocationModal.js';
import BMLTResult from './BMLTResult.js';

class LocationBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress_text: 'Initializing...',
      progress_total_steps: 4,
      progress_current_step: 0
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation({ forceGeocode = false } = {}) {
    this.setState({
      progress_text: 'Determining location...',
      progress_current_step: 1,
      meeting: undefined,
      rootServer: undefined
    });

    let urlParams = new URLSearchParams(window.location.search);
    if (forceGeocode || urlParams.has('forceGeocode')) {
      this.setState({
        askForLocation: true,
      });
    } else if (urlParams.has('latitude') && urlParams.has('longitude')) {
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
          this.setState({
            askForLocation: true,
          });
        },
        {
          timeout: 15000,
          maximumAge: 60000
        }
      );
    }
  }

  getNearestMeeting(latitude, longitude) {
    this.setState({
      progress_text: 'Finding nearest meeting...',
      progress_current_step: 2,
      latitude: latitude,
      longitude: longitude,
      askForLocation: false
    });

    let url = `https://tomato.na-bmlt.org/main_server/client_interface/json/?switcher=GetSearchResults&lat_val=${latitude}&long_val=${longitude}&geo_width=-1`;
    let options = {headers: {'user-agent': navigator.userAgent + ' +dihtbmlt'}};
    fetch(url, options).then(
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
      progress_current_step: 3,
      meeting: meeting
    });

    let rootServerId = meeting.root_server_id;
    let url = `https://tomato.na-bmlt.org/rest/v1/rootservers/${rootServerId}/`;
    let options = {headers: {'user-agent': navigator.userAgent + ' +dihtbmlt'}};
    fetch(url, options).then(
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
      let miles = Math.round(Math.round(this.state.meeting.distance_in_miles));
      let hasBMLT = miles < 100;
      return (
        <div>
          <BMLTResult
            numMiles={this.state.meeting.distance_in_miles}
            hasBMLT={hasBMLT}
            rootServerURL={this.state.rootServer.root_server_url}
            searchAgainHandler={() => this.getLocation({forceGeocode:true})} />
        </div>

      );
    } else {
      let handleError = () => {
        this.setState({
          progress_text: 'Error: Could not find your location, please try again',
          askForLocation: false
        });
      };

      return (
        <div>
          <Progress
            total={this.state.progress_total_steps}
            value={this.state.progress_current_step}
            label={this.state.progress_text}/>
          <GetLocationModal
            visible={this.state.askForLocation}
            successCallback={(lat, long) => this.getNearestMeeting(lat, long)}
            errorCallback={handleError}/>
        </div>
      )
    }
  }
}

export default LocationBox;