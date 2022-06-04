import { useTypedSelector } from './index';

export const useCumulativeCode = (cellId: string) => {
  // Cumulative Code
  return useTypedSelector((state) => {
    const { data, order } = state.cells || {};

    const orderedCells = order && order.map((id: string) => data && data[id]);

    const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var show = (value) => {
      const root =  document.querySelector('#root');
      if(typeof value === 'object'){
        if(value.$$typeof && value.props){
          _ReactDOM.render(value ,root)
        } else {
         root.innerHTML = JSON.stringify(value , null , 4);
        }
      } else {
        root.innerHTML = value;
      }
    }
  `;

    const showFuncNoop = "var show = () => {}";

    const cumulativeCode = [];

    if (orderedCells) {
      for (let c of orderedCells) {
        if (c && c.type === "code") {
          if (c.id === cellId) {
            cumulativeCode.push(showFunc);
          } else {
            cumulativeCode.push(showFuncNoop);
          }
          cumulativeCode.push(c.content);
        }
        if (c && c.id === cellId) break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
