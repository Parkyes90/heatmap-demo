import React from 'react';
import { Component } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import ControlPanel from './control-panel';
import { json as requestJson } from 'd3-request';
import { heatmapLayer, countiesLayer } from './map-style';
import seongnam2 from 'assets/maps/seongnam2.json';
import geo from 'assets/values/geo_0.json';
function filterFeaturesByDay(featureCollection: any, time: any) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter((feature: any) => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return { type: 'FeatureCollection', features };
}

type ViewPort = {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
};
type State = {
  filter?: any;
  data?: any;
  viewport: ViewPort;
  allDay: boolean;
  startTime: number;
  endTime: number;
  selectedTime: number;
  earthquakes: any;
};

export default class MapBox extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const current = new Date().getTime();

    this.state = {
      data: geo,
      filter: ['in', 'COUNTY', ''],
      viewport: {
        latitude: 37.4,
        longitude: 127.1388684,
        zoom: 12,
        bearing: 0,
        pitch: 0,
      },
      allDay: true,
      startTime: current,
      endTime: current,
      selectedTime: current,
      earthquakes: geo,
    };

    this._handleChangeDay = this._handleChangeDay.bind(this);
    this._handleChangeAllDay = this._handleChangeAllDay.bind(this);
  }
  // componentDidMount() {
  //   requestJson(
  //     'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
  //     (error, response) => {
  //       if (!error) {
  //         // Note: In a real application you would do a validation of JSON data before doing anything with it,
  //         // but for demonstration purposes we ingore this part here and just trying to select needed data...
  //         const features = response.features;
  //         const endTime = features[0].properties.time;
  //         const startTime = features[features.length - 1].properties.time;
  //         console.log(response);
  //         this.setState({
  //           data: response,
  //           earthquakes: response,
  //           endTime,
  //           startTime,
  //           selectedTime: endTime,
  //         });
  //       }
  //     },
  //   );
  // }
  _onViewportChange = (viewport: ViewPort) => this.setState({ viewport });

  _handleChangeDay = (time: number) => {
    this.setState({ selectedTime: time });
    if (this.state.earthquakes) {
      this.setState({
        data: filterFeaturesByDay(this.state.earthquakes, time),
      });
    }
  };

  _handleChangeAllDay = (allDay: boolean) => {
    this.setState({ allDay });
    if (this.state.earthquakes) {
      this.setState({
        data: allDay
          ? this.state.earthquakes
          : filterFeaturesByDay(
              this.state.earthquakes,
              this.state.selectedTime,
            ),
      });
    }
  };

  render() {
    const {
      viewport,
      data,
      allDay,
      selectedTime,
      startTime,
      endTime,
    } = this.state;

    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onViewportChange={this._onViewportChange}
        >
          {data && (
            <Source type="geojson" data={data}>
              <Layer {...(heatmapLayer as any)} />
            </Source>
          )}
          <Source type="geojson" data={seongnam2 as any} id="seongnam">
            <Layer
              source="seongnam"
              {...countiesLayer}
              filter={['==', '$type', 'Polygon']}
            />
          </Source>
        </MapGL>
        <ControlPanel
          startTime={startTime}
          endTime={endTime}
          selectedTime={selectedTime}
          allDay={allDay}
          onChangeDay={this._handleChangeDay}
          onChangeAllDay={this._handleChangeAllDay}
        />
      </div>
    );
  }
}
