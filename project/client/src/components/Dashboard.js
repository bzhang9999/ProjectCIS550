import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
//import GenreButton from './GenreButton';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const containerStyle = {
    position: 'absolute',  
    width: '85%',
    height: '80%',
    top: 220,
    left: 100
}

const divStyle = {
    display: 'flex',
    alignItems: 'center'
};


export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    

    this.state = {
      allConflicts: [],
      side1codes: [],
      side1position: [],
      side2codes: [],
      side2position: [],

      displayWindow: true,
      selectedMarker: {},
      selectedPlace: {},

      selectedConflict: {}
    }

    this.showOnMap = this.showOnMap.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/conflicts", {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(conflictList => {
        if (!conflictList) return;
        // let conflictDivs = conflictList.map((conflictObj, i) =>
        //   <GenreButton id={"button-" + conflictObj.name} onClick={() => this.showOnMap(conflictObj.name)} name={conflictObj.name} />
        // );

        let conflictDivs = conflictList.map((conflictObj, i) =>
          <option value ={conflictObj.name}>{conflictObj.name}</option>        
        );
        


        this.setState({
          // allConflicts: conflictDivs
          allConflicts: conflictDivs
        })
      })
      .catch(err => console.log(err)) // Print the error if there is one.
  }



  showOnMap(conflict) {
     this.setState({
          side1position: [],
          side2position: []
        })
    let route = "http://localhost:8081/conflicts/" + conflict;
    fetch(route, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(countryList => {
        if (!countryList) {
          console.log("problem with response");
          return;
        }

        let countryUrls = async() => {
          for (var i=0; i<countryList.length; i++) {
            var cCode = countryList[i].Country;
            let geoCodeRoute = "https://maps.googleapis.com/maps/api/geocode/json?components=country:" + 
            cCode+ "%7C&key=AIzaSyC4uWVv0o6wzhqyPCf5H6BnRFbNfU79KqM";

            var cdeaths = countryList[i].num_deaths;
            var cside = countryList[i].side;
            var realName = countryList[i].RealName;

            await fetch(geoCodeRoute, {
              method: 'GET'
            })
            .then(res => res.json())
            .then(resultList => {
              if (!resultList) {
                console.log("ResultList empty!");
                return;
              }

              var lat = resultList["results"][0].geometry.location.lat;
              var lng = resultList["results"][0].geometry.location.lng;

              if (cside == 1) {
                this.setState({side1position:[...this.state.side1position, {lat: lat, lng: lng, deaths: cdeaths, realName: realName}]
                });
              }
              else if (cside == 2) {
                this.setState({side2position:[...this.state.side2position, {lat: lat, lng: lng, deaths: cdeaths, realName: realName}]
                });
              }

            })
              .catch(err => console.log(err))
          }
        }
        countryUrls();
      }).catch(err => console.log(err))
  }

  displayMarkers1 = () => {
    return this.state.side1position.map((obj, index) => {
      return <Marker 
      key={index} 
      id={index} 
      position={{lat: obj.lat, lng: obj.lng}}
      deaths={obj.deaths}
      realName={obj.realName}
      onClick={this.onMarkerClick} />
    })
  }

  displayMarkers2 = () => {
    return this.state.side2position.map((obj, index) => {
      return <Marker 
      key={index} 
      id={index} 
      position={{lat: obj.lat, lng: obj.lng}}
      deaths={obj.deaths}
      realName={obj.realName}
      icon={{url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}}
      onClick={this.onMarkerClick}/>
    })
  }


  onMarkerClick = (props, marker, e) =>
    this.setState({
      displayWindow: true,
      selectedMarker: marker,
      selectedPlace: props
  });

  handleChange(e) {
    this.setState({
      selectedConflict: e.target.value
    })
  }

  render() {    
    return (

      <div className="Dashboard">



        <PageNavbar active="dashboard" />

         <div className="container bestgenres-container">

			      <div className="jumbotron1">
			        <div className="h5">Explore Conflicts</div>

                <div className="dropdowns-container">
                  <div className="countryDropdown1-container">
                 
                    <select value={this.state.selectedConflict} onChange={this.handleChange} className="dropdown" id="countryDropdown1">
                        <option select value> -- Select A Conflict -- </option>
                          {this.state.allConflicts}
                    </select>

                    <button className="submit-btn" id="SubmitBtn" onClick={() => this.showOnMap(this.state.selectedConflict)}> Submit</button>
                  </div>
                </div>

            </div>
         </div>


        <Map google={this.props.google} zoom={3} initialCenter={{lat: 30,lng: -20}} containerStyle={containerStyle}>

          {this.displayMarkers1()}
          {this.displayMarkers2()}
          
          <InfoWindow
            marker={this.state.selectedMarker}
            visible={this.state.displayWindow}
          >
            <div>
              <h4>{this.state.selectedPlace.realName}</h4>
              <h4>Deaths: {this.state.selectedPlace.deaths}</h4>
            </div>
          </InfoWindow>

        </Map>
         

      </div>
    )

  }

}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyC4uWVv0o6wzhqyPCf5H6BnRFbNfU79KqM")
})(Dashboard)
