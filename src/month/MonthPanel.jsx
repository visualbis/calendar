import React from 'react';
import ReactDOM from "react-dom";
import 'react-input-range/lib/css/index.css'
import InputRange from 'react-input-range';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import MonthTable from './MonthTable';
function goYear(direction) {
  const next = this.state.value.clone();
  next.add(direction, 'year');
  this.setAndChangeValue(next);
}
function onInputChange(event) {
  var value = event.target.value;
  if(event.target.value.toString().length === 4){
    this.props.calendarprops[event.target.name] = event.target.value;
    this.props.onRangeSelect();
  }
  
}
function onRangeChange(value) {   
    this.props.calendarprops["rangestart"] = this.state.valuerange.min;
    this.props.calendarprops["rangeend"] = this.state.valuerange.max;
    this.props.onRangeSelect(); 
  
}
function noop() {

}
function showIf(condition, el) {
  return condition ? el : null;
}
const MonthPanel = createReactClass({
  propTypes: {
    onChange: PropTypes.func,
    disabledDate: PropTypes.func,
    onSelect: PropTypes.func,
  },

  getDefaultProps() {
    return {
      onChange: noop,
      onSelect: noop,
    };
  },

  getInitialState() {
    const props = this.props;
    // bind methods
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    this.onchange =  onInputChange.bind(this);
    this.onrangechange =  onRangeChange.bind(this);
    this.prefixCls = `${props.rootPrefixCls}-month-panel`;
    return {
      value:  props.value || props.defaultValue,
      minrange:props.calendarprops.minrange,
      maxrange:props.calendarprops.maxrange,
      valuerange: {
        min: props.calendarprops.rangestart,
        max: props.calendarprops.rangeend,
      }
    };
  
  
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
    if ('calendarprops' in nextProps) {
      this.setState({
        minrange:nextProps.calendarprops.minrange,
        maxrange:nextProps.calendarprops.maxrange,
        valuerange: {
          min: nextProps.calendarprops.rangestart,
          max: nextProps.calendarprops.rangeend,
        }
      });
    }
  }, 

  setAndChangeValue(value) {
    this.setValue(value);
    this.props.onChange(value);
  },

  setAndSelectValue(value) {
    this.setValue(value);
    this.props.onSelect(value);
  },

  setValue(value) {
    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }
  },

  render() {
    const props = this.props;
    const value = this.state.value;
    const cellRender = props.cellRender;
    const contentRender = props.contentRender;
    const { locale } = props;
    const year = value.year();
    const prefixCls = this.prefixCls;
   const headfontStyle = {
     'font-weight':'bold'
   };
   const inputStyle = {
height:'30px'

   };

    return (
      <div className={prefixCls} style={props.style}>
        <div>       
          <div className={`${prefixCls}-header`}>
          {showIf(this.props.calendarprops.rangemode && this.props.calendarprops.rangetype !== "slider",
              <div>
                <span style={headfontStyle}>From </span>
                <input
                style={inputStyle}
                className={`${prefixCls}-start-year-input`}
                type="number" min="1000" max="9999"
                name="rangestart"
                value={this.props.calendarprops.rangestart}
                onChange={this.onchange}
              />
               <span style={headfontStyle}>To </span>
               <input
                style={inputStyle}
                className={`${prefixCls}-end-year-input`}
                type="number" min="1000" max="9999"
                name="rangeend"
                value={this.props.calendarprops.rangeend}
                onChange={this.onchange}
              />
              </div>
            )}
              {showIf(this.props.calendarprops.rangemode && (this.props.calendarprops.rangetype == "slider" || this.props.calendarprops.rangetype == "slider-text"),
              <InputRange           
              maxValue={this.state.maxrange}
              minValue={this.state.minrange}
              formatLabel={value => `${value}`}
              value={this.state.valuerange}
              onChange={value => this.setState({ valuerange: value })}
              onChangeComplete={this.onrangechange} />
            )}
          

            {/* {showIf(this.props.calendarprops.rangemode && this.props.calendarprops.rangetype !== "slider",
              <span style={headfontStyle}>From </span>
            )}
            {showIf(this.props.calendarprops.rangemode && this.props.calendarprops.rangetype !== "slider",
              <input
                style={inputStyle}
                className={`${prefixCls}-start-year-input`}
                type="number" min="1000" max="9999"
                name="rangestart"
                value={this.props.calendarprops.rangestart}
                onChange={this.onchange}
              />)}
            {showIf(this.props.calendarprops.rangemode && this.props.calendarprops.rangetype !== "slider",
              <span style={headfontStyle}>To </span>
            )}
            {showIf(this.props.calendarprops.rangemode && this.props.calendarprops.rangetype !== "slider",
              <input
                style={inputStyle}
                className={`${prefixCls}-end-year-input`}
                type="number" min="1000" max="9999"
                name="rangeend"
                value={this.props.calendarprops.rangeend}
                onChange={this.onchange}
              />)} */}
             {showIf(!this.props.calendarprops.rangemode,
            <a
              className={`${prefixCls}-prev-year-btn`}
              role="button"
              onClick={this.previousYear}
              title={locale.previousYear}
            />)}
            {showIf(!this.props.calendarprops.rangemode,
            <a
              className={`${prefixCls}-year-select`}
              role="button"
              onClick={props.onYearPanelShow}
              title={locale.yearSelect}
            >
              <span className={`${prefixCls}-year-select-content`}>{year}</span>
              <span className={`${prefixCls}-year-select-arrow`}>x</span>
            </a>)}
            {showIf(!this.props.calendarprops.rangemode,
            <a
              className={`${prefixCls}-next-year-btn`}
              role="button"
              onClick={this.nextYear}
              title={locale.nextYear}
            />)}
          </div>
          <div className={`${prefixCls}-body`}>
            <MonthTable
              disabledDate={props.disabledDate}
              onSelect={this.setAndSelectValue}
              monthflow={this.props.monthflow}
              onQuarterSelect={this.props.onQuarterSelect}           
              calendarprops = {this.props.calendarprops}
              type={this.props.type}
              selectedvalue ={this.props.selectedvalue}
              locale={locale}
              value={value}
              cellRender={cellRender}
              contentRender={contentRender}
              prefixCls={prefixCls}
            />
          </div>
        </div>
      </div>);
  },
});

export default MonthPanel;
