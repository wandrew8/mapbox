import React from 'react';
import mapboxgl from 'mapbox-gl';
import FormComponent from './components/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'
import './App.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;


export default class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        lng: -122.34, 
        lat: 47.61,
        zoom: 10,
        city: 'Seattle',
        state: 'WA',
        searchInfo: []
      }
    }

    getMap = () => {
      const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.state.lng, this.state.lat],
        zoom: this.state.zoom
        });
        map.on('move', () => {
          this.setState({
          lng: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2)
          });
          });
          console.log(this.state)
    }

    componentDidMount() {
      this.getMap();
      this.getCityInfo();
    }

    showFullScreen = () => {
      this.mapContainer.classList.toggle("fullScreen");
      this.getMap();
    }

    createMarkup(html) {
      return {__html: html};
    }

    getCoordinates = (zipCode) => {
      fetch(`https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/${process.env.REACT_APP_ZIPCODE_API}/info.json/${zipCode}/degrees`, {
        method: 'GET',
        headers:{
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          city: data.city,
          state: data.state,
          lat: data.lat,
          lng: data.lng
        }, () => {
          this.getMap();
          this.getCityInfo();
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

    getCityInfo = () => {
      fetch(`https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${this.state.city}&format=json`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ searchInfo: data.query.search})
      })
      .catch(err => console.log(err))
    }

    render() {
        return (
          <div className="grid">
            <div className="grid-inside">
              <FormComponent 
                city={this.state.city}
                state={this.state.state}
                getCoordinates={this.getCoordinates}
              />
              <div>
                {this.state.searchInfo.length > 0 ? this.state.searchInfo.filter((query, i) => (i <= 2)).map(item => {
                  return (
                    <div className="article" dangerouslySetInnerHTML={this.createMarkup(item.snippet)} />
                  )
                }) : null}
              </div>
            </div>
            <div className="mapContainer" ref={el => this.mapContainer = el}>
            <FontAwesomeIcon icon={faExpand} onClick={this.showFullScreen} className="icon"/>
            </div>
              
          </div>
        );

    }
}
