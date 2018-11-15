import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getTodayTime, getMonthName } from '../util/index';

const ROW = 4;
const COL = 3;

function chooseMonth(month) {
  const next = this.state.value.clone();
  if(this.props.type === "yqm" ||this.props.type === "yqmm" ){
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
  arrangeMonths(months,type,monthflow){
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
    this.arrangeMonths(months,props.type,props.monthflow);
    const monthsEls = months.map((month, index) => {
      const tds = month.map(monthData => {
        let disabled = false;
        if (props.disabledDate) {
          const testValue = value.clone();
          testValue.month(monthData.value);
          disabled = props.disabledDate(testValue);
        }
        let ismSelected = false;
        let isySelected = false;
        if(props.selectedvalue){         
          if(props.selectedvalue[ value._d.getFullYear()] && props.selectedvalue[value._d.getFullYear()].indexOf(monthData.value)>-1){
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
            content = contentRender(currentValue, locale);
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
