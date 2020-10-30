import React, { useEffect, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import seongnam from 'assets/maps/seongnam.json';
import seongnam2 from 'assets/maps/seongnam2.json';
import geo from 'assets/maps/geo.json';
import geoValues from 'assets/maps/geo-values.json';
import { setInterval } from 'timers';
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
function App() {
  const namedSeongnam = seongnam;
  const [time] = useState(0);
  const data: any = [];
  namedSeongnam.features = namedSeongnam.features.map((f) => {
    const parsed = f.properties.adm_nm.split('성남시');
    const name = parsed[parsed.length - 1];
    data.push({ name, value: getRandomInt(0, 49539) });
    return {
      ...f,
      properties: {
        ...f.properties,
        name,
      },
    };
  });

  const ref = useRef<ReactEcharts>(null);
  useEffect(() => {
    if (ref) {
      echarts.registerMap('성남', seongnam);
      echarts.registerMap('성남2', geo);
    }
  }, [ref]);
  return (
    <div className="App">
      <div>시간 {time}</div>
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
              max: 49539,
              inRange: {
                color: [
                  '#313695',
                  '#4575b4',
                  '#74add1',
                  '#abd9e9',
                  '#e0f3f8',
                  '#ffffbf',
                  '#fee090',
                  '#fdae61',
                  '#f46d43',
                  '#d73027',
                  '#a50026',
                ],
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
              data: geoValues,
            },
          ],
        }}
        ref={ref}
      />
    </div>
  );
}

export default App;
