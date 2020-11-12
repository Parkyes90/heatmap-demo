import React, { useEffect, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import seongnam from 'assets/maps/seongnam.json';
import { getRandomInt, getSData, getValues } from './helpers';
import geo_0 from 'assets/values/geo_0.json';
import value_0 from 'assets/values/values_0.json';

function App() {
  const namedSeongnam = seongnam;
  const [time, setTime] = useState(0);
  const [values, setValues] = useState(getValues(value_0));
  const [featureCollection, setFeatureCollection] = useState(getSData(geo_0));
  const data: any = [];
  namedSeongnam.features = namedSeongnam.features.map((f) => {
    const parsed = f.properties.adm_nm.split('성남시');
    const name = parsed[parsed.length - 1];
    data.push({ name, value: getRandomInt(0, 1) });
    return {
      ...f,
      properties: {
        ...f.properties,
        name,
      },
    };
  });

  useEffect(() => {
    if (time > 0 && time < 10) {
      const jsonValues = require(`assets/values/values_${time}.json`);
      const jsonGeo = require(`assets/values/geo_${time}.json`);
      setValues(getValues(jsonValues));
      setFeatureCollection(getSData(jsonGeo));
    }
  }, [time]);

  const ref = useRef<ReactEcharts>(null);
  useEffect(() => {
    echarts.registerMap('성남', seongnam);
    echarts.registerMap('성남2', featureCollection);
  }, [featureCollection]);
  return (
    <div className="App">
      <div>시간 {time}</div>
      <button
        onClick={() => {
          setTime((prev) => {
            return prev + 1;
          });
        }}
      >
        다음 시간
      </button>
      <ReactEcharts
        opts={{
          width: 1000,
          height: 1000,
        }}
        option={{
          visualMap: [
            {
              left: 'right',
              min: 0,
              max: 500,
              inRange: {
                color: ['#EDF6FD', '#8CD2FE', '#3D98EE', '#2F46B1', '#00004D'],
              },
              text: ['High', 'Low'], // 文本，默认为数值文本
              calculable: true,
            },
          ],

          tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params: any) {
              // console.log(params);
              let value: any = (params.value + '').split('.');
              value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
              return params.seriesName + '<br/>' + params.name + ': ' + value;
            },
          },

          series: [
            {
              name: '성남',
              type: 'map',
              roam: true,
              map: '성남',
              emphasis: {
                label: {
                  show: true,
                },
              },

              data,
            },
            {
              name: '성남2',
              type: 'map',
              roam: true,
              map: '성남2',
              emphasis: {
                label: {
                  show: true,
                },
              },
              itemStyle: {
                borderWidth: 0,
              },
              data: values as any,
            },
          ],
        }}
        ref={ref}
      />
    </div>
  );
}

export default App;
