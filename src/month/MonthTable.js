import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getTodayTime, getMonthName } from '../util/index';

const ROW = 4;
const COL = 3;

function chooseMonth(month) {
  const next = this.state.value.clone();
  if(this.props.calendarprops.type === "yqm" ||this.props.calendarprops.type === "yqmm" || this.props.calendarprops.type === "ym"){
    this.props.onQuarterSelect(next.year(),month);
  }else{
    next.month(month);
    this.setAndSelectValue(next);
  }
 
}

function noop() {

}

class MonthTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  setAndSelectValue(value) {
    this.setState({
      value,
    });
    this.props.onSelect(value);
  }
  arrangeMonths(months,type,monthflow,isfiscal){
    const quartertype = ["yqm","yqmm"];
    const quarter =[
      {value: 12, content: "Q1", title: "Q1"},
      {value: 13, content: "Q2", title: "Q2"},
      {value: 14, content: "Q3", title: "Q3"},
      {value: 15, content: "Q4", title: "Q4"}
    ];   
    const dMonths = [];
    if(monthflow == "vertical"){
      months.forEach(function(item,index){
        item.forEach(function(mitem,mIndex){
          if(!dMonths[mIndex]){
            dMonths[mIndex]=[];             
           }
           dMonths[mIndex].push(mitem);
         });
       });
       if(quartertype.indexOf(type)>-1){         
        dMonths.unshift(quarter);
       }    
       while(months.length > 0) {        
        months.pop();
       }
    dMonths.forEach(function(item,index){
      months.push(item);
    });
    }else{
      if(quartertype.indexOf(type)>-1){   
        months.forEach(function(item,index){
          item.unshift(quarter[index]);
        });
      }
    }
    
    if(isfiscal){
      var mindex = [0,1,2,3,4,5,6,7,8,9,10,11];
      var msplice = mindex.splice(2);
      mindex = msplice.concat(mindex);
      var marray = []; 
      months.forEach(function(item,index){
        item.forEach(function(mitem,mIndex){
          if(mitem.value<12){
            var ind = mindex.indexOf(mitem.value);
            marray[ind] = {};
            marray[ind]["content"] = mitem.content;
            marray[ind]["title"] = mitem.title;
          }
         
         });
       });
      months.forEach(function(item,index){
        item.forEach(function(mitem,mIndex){
          if(mitem.value<12){
            mitem.content = marray[mitem.value]["content"];     
            mitem.title = marray[mitem.value]["title"];   
          }     
         });
       });
    

    }
  

  }

  months() {
    const value = this.state.value;
    const current = value.clone();
    const months = [];
    let index = 0;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      months[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        current.month(index);
        const content = getMonthName(current);
        months[rowIndex][colIndex] = {
          value: index,
          content,
          title: content,
        };
        index++;
      }
    }
    return months;
  }

  render() {
    const props = this.props;
    const value = this.state.value;
    const today = getTodayTime(value);
    let months = this.months();
    const currentMonth = value.month();
    const { prefixCls, locale, contentRender, cellRender } = props;
    this.arrangeMonths(months,props.calendarprops.type,props.calendarprops.monthflow,props.calendarprops.enablefiscal);
    
    const monthsEls = months.map((month, index) => {
      const tds = month.map(monthData => {
        let disabled = false;
        if (props.disabledDate) {
          const testValue = value.clone();
          testValue.month(monthData.value);
          disabled = props.disabledDate(testValue,monthData.value);
        }
        let ismSelected = false;
        let isySelected = false;
        if(props.calendarprops.selectedvalue){         
          if(props.calendarprops.selectedvalue[ value._d.getFullYear()] && props.calendarprops.selectedvalue[value._d.getFullYear()].indexOf(monthData.value)>-1){
            ismSelected = true;
            isySelected = true;
          }
        }
        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          [`${prefixCls}-selected-cell`]: ismSelected,
          [`${prefixCls}-current-cell`]:isySelected
        };
        let cellEl;
        if (cellRender) {
          const currentValue = value.clone();
          currentValue.month(monthData.value);
          cellEl = cellRender(currentValue, locale);
        } else {
          let content;
          if (contentRender) {
            const currentValue = value.clone();
            currentValue.month(monthData.value);
            content = contentRender(currentValue, locale,monthData.value);
          } else {
            content = monthData.content;
          }
          cellEl = (
            <a className={`${prefixCls}-month`}>
              {content}
            </a>
          );
        }
        return (
          <td
            role="gridcell"
            key={monthData.value}
            onClick={disabled ? null : chooseMonth.bind(this, monthData.value)}
            title={monthData.title}
            className={classnames(classNameMap)}
          >
            {cellEl}
          </td>);
      });
      return (<tr key={index} role="row">{tds}</tr>);
    });

    return (
      <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
        <tbody className={`${prefixCls}-tbody`}>
        {monthsEls}
        </tbody>
      </table>
    );
  }
}

MonthTable.defaultProps = {
  onSelect: noop,
};
MonthTable.propTypes = {
  onSelect: PropTypes.func,
  cellRender: PropTypes.func,
  prefixCls: PropTypes.string,
  value: PropTypes.object,
};
export default MonthTable;
