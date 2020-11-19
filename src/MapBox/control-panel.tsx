import * as React from 'react';
import { PureComponent } from 'react';

type Props = {
  startTime: number;
  endTime: number;
  selectedTime: number;
  allDay: boolean;
  onChangeDay: any;
  onChangeAllDay: any;
};

export default class ControlPanel extends PureComponent<Props> {
  render() {
    const {
      startTime,
      endTime,
      onChangeDay,
      allDay,
      onChangeAllDay,
      selectedTime,
    } = this.props;
    const day = 24 * 60 * 60 * 1000;
    const days = Math.round((endTime - startTime) / day);

    const _onChangeDay = (evt: any) => {
      const daysToAdd = evt.target.value;
      // add selected days to start time to calculate new time
      const newTime = startTime + daysToAdd * day;
      onChangeDay(newTime);
    };

    const formatTime = (time: any) => {
      const date = new Date(time);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
      <div className="control-panel">
        <h3>Heatmap</h3>
        <p>
          Map showing Floating Population
          <br />
          from <b>{formatTime(startTime)}</b> to <b>{formatTime(endTime)}</b>.
        </p>
        <hr />
        <div className="input">
          <label>All Days</label>
          <input
            type="checkbox"
            name="allday"
            checked={allDay}
            onChange={(evt) => onChangeAllDay(evt.target.checked)}
          />
        </div>
        <div className={`input ${allDay ? 'disabled' : ''}`}>
          <label>Each Day: {formatTime(selectedTime)}</label>
          <input
            type="range"
            disabled={allDay}
            min={1}
            max={days}
            step={1}
            onChange={_onChangeDay}
          />
        </div>
        <hr />
      </div>
    );
  }
}