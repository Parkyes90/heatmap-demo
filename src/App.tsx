import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import seongnam from 'assets/maps/seongnam.json';
import { getRandomInt, getSData, getValues } from './helpers';

function App() {
  const namedSeongnam = seongnam;
  const [time, setTime] = useState(0);
  const ref = useRef<ReactEcharts>(null);
  const data: any = useMemo(() => [], []);
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
  const jsonValues = require(`assets/values/values_${time}.json`);
  const jsonGeo = require(`assets/values/geo_${time}.json`);
  useEffect(() => {
    let isPaused = false;
    const interval = setInterval(() => {
      if (!isPaused) {
        setTime((prev) => {
          if (prev >= 23) {
            return 0;
          }
          return prev + 1;
        });
      }
    }, 500);
    if (ref.current) {
      const instance = ref.current.getEchartsInstance();
      instance.on('mouseover', () => {
        isPaused = true;
      });
      instance.on('mouseout', () => {
        isPaused = false;
      });
    }
    return () => {
      clearInterval(interval);
    };
  }, [ref]);

  useEffect(() => {
    echarts.registerMap('성남', seongnam);
    echarts.registerMap('성남2', getSData(jsonGeo));
  }, [jsonGeo]);
  return (
    <div className="App">
      <div>시간 {time}</div>
      <button
        onClick={() => {
          setTime((prev) => {
            if (prev >= 23) {
              return 0;
            }
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
        lazyUpdate
        notMerge
        option={{
          visualMap: [
            {
              left: 'right',
              min: 0,
              max: 100,
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
              data: getValues(jsonValues),
            },
          ],
        }}
        ref={ref}
      />
    </div>
  );
}

export default App;
