import React from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';
import EchartComponent from './EchartComponent';
import MapBox from './MapBox';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const history = useHistory();
  return (
    <Switch>
      <Route
        exact
        path="/"
        component={(): React.ReactElement => {
          return (
            <div>
              <button
                onClick={() => {
                  history.push('/echart');
                }}
              >
                echart
              </button>
              <button
                onClick={() => {
                  history.push('/mapbox');
                }}
              >
                mapbox
              </button>
            </div>
          );
        }}
      />
      <Route exact path="/echart" component={EchartComponent} />
      <Route exact path="/mapbox" component={MapBox} />
    </Switch>
  );
}

export default App;
