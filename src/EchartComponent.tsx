import React, { useEffect, useMemo, useRef, useState } from 'react';
import seongnam from './assets/maps/seongnam.json';
import ReactEcharts from 'echarts-for-react';
import { getRandomInt, getSData, getValues } from './helpers';
import echarts from 'echarts';

const EchartComponent: React.FC = () => {
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
    <div className="App" style={{ height: '100%' }}>
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
        lazyUpdate
        notMerge
        style={{ height: '80%', width: '80%' }}
        option={{
          grid: {
            width: '100%',
            height: '100%',
          },
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
              name: '성남2',
              type: 'map',
              roam: true,
              map: '성남2',
              draggable: false,
              emphasis: {
                label: {
                  show: true,
                },
              },
              scaleLimit: {
                max: 1,
                min: 1,
              },
              itemStyle: {
                opacity: 1,
                borderWidth: 0,
              },
              data: getValues(jsonValues) as any,
            },
            {
              name: '성남',
              type: 'map',
              roam: true,
              zoom: 1,
              draggable: false,
              map: '성남',
              scaleLimit: {
                max: 1,
                min: 1,
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
              itemStyle: {
                opacity: 0.3,
              },

              data,
            },
          ],
        }}
        ref={ref}
      />
    </div>
  );
};

export default EchartComponent;
