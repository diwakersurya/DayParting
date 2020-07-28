import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import _ from "lodash";


render(<App />, document.getElementById('root'));
 
function checkOverlap(l1,r1,l2,r2){
  //console.log(l1.x,l1.y,r1.x,r1.y,l2.x,l2.y,r2.x,r2.y)
   // If one rectangle is on left side of other 
    if (l1.x >= r2.x || l2.x >= r1.x) {
        return false; 
    }
  
    // If one rectangle is above other 
    if (l1.y >= r2.y || l2.y >= r1.y) {
     // if (r1.y <= l2.y || r2.y >= l1.y) {
        return false; 
    }

    return true;
}

function Cell({ rowNo, name, checked, onChange,isMouseDown,initialCoordinates,currentCoordinates,onUnderRectangle }) {
  const [rect,setRect]=React.useState(null);
  const cellRef=React.useRef(null);
  function onClick(e) {
    let val = e.target.checked ? 1 : 0;
    onChange(rowNo, name, val);
  }

  // function onMouseEnter(){
  //   if(isMouseDown){
  //     //calculate if this checkbox lies under the area
  //     if(!checked){
  //       onChange(rowNo, name, 1);
  //     }
  //   }
  // }
  React.useEffect(()=>{
    if(initialCoordinates && currentCoordinates && isMouseDown && !checked){
      // const {x:xs,y:ys}=initialCoordinates;
      // const {x:xe,y:ye}=currentCoordinates;
      const rect1={initialCoordinates,currentCoordinates};
 

      let {left:x,top:y,width,height}=rect;
      x=Math.floor(x);
      y=Math.floor(y);
      const rect2={initialCoordinates:{x,y},currentCoordinates:{x:x+width,y:y+height}}

      //check if the two rectangles overlap
      //https://www.geeksforgeeks.org/find-two-rectangles-overlap/
      // console.log(rect1,rect2);
    //  console.log(rect1.initialCoordinates,rect1.currentCoordinates,rect2.initialCoordinates,rect2.currentCoordinates)
    //  console.log(checkOverlap(rect1.initialCoordinates,rect1.currentCoordinates,rect2.initialCoordinates,rect2.currentCoordinates))
      if(checkOverlap(rect1.initialCoordinates,rect1.currentCoordinates,rect2.initialCoordinates,rect2.currentCoordinates)){
        onUnderRectangle(rowNo,name)
      }
      // if(x>=initialCoordinates.x && x<=currentCoordinates.x){
      //   if(y>=initialCoordinates.y && y<=currentCoordinates.y){
      //      onChange(rowNo,name,1)
      //   }
      // }

    }
  },[initialCoordinates,currentCoordinates,rect,isMouseDown])

  React.useEffect(()=>{
    setRect(cellRef.current.getBoundingClientRect());
  },[])

  return (
    // <span   style={{border:"1px solid blue"}} >
      <input  ref={cellRef} name={name} type="checkbox"  onChange={onClick} checked={checked} />
      // </span>
  );
}
function Row({ rowNo, name, values, onChange, disabled,isMouseDown,initialCoordinates,currentCoordinates,onUnderRectangle }) {
  return (
    <>
      {name}
      {values.map((item, index) => {
        return (
          <Cell
            name={index}
            rowNo={rowNo}
            onChange={onChange}
            disabled={disabled}
            isMouseDown={isMouseDown}
            initialCoordinates={initialCoordinates}
            currentCoordinates={currentCoordinates}
            onUnderRectangle={onUnderRectangle}
            checked={item === 1 ? true : false}
          />
        );
      })}
    </>
  );
}
function DayParting({ value, onChange, disabled }) {
  const [isMouseDown,setIsMouseDown]=React.useState(false);
  const [initialCoordinates,setInitialCoordinates]=React.useState(null);
  const [currentCoordinates,setCurrentCoordinates]=React.useState(null);
  const [selectionBoxStyle,setSelectionBoxStyle]=React.useState({})
  function onRowChange(rowNo, index, rowValue) {
    console.log("onRowChange",rowNo,index,rowValue)
    const newValue = [...value];
    const indexToUpdate = rowNo * 24 + parseInt(index, 10);
    newValue[indexToUpdate] = rowValue;
    onChange(newValue);
  }
  function onMouseDown(e) {
   // console.log(e.pageX,e.pageY);
    setIsMouseDown(true);
    setInitialCoordinates({x:e.pageX,y:e.pageY})
    //setCurrentCoordinates({x:e.pageX,y:e.pageY});
  }
  function onMouseUp() {
    setIsMouseDown(false);
    setInitialCoordinates(null);
    setCurrentCoordinates(null);
  }
  const onMouseMove=(e)=> {
   if(isMouseDown){
     const {pageX:x,pageY:y}=e;
         //  console.log(x,y)
      setCurrentCoordinates({x,y});
   }
  }

  function onUnderRectangle(rowNo,index){
     console.log("onUnderRectangle",rowNo,index)
    const indexToUpdate = rowNo * 24 + parseInt(index, 10);
    value[indexToUpdate] = 1;
    onChange(value);
  }

  React.useLayoutEffect(()=>{
    if(isMouseDown){
      let selectionBoxStyle={border:"1px solid red",position:"absolute"};
      if(initialCoordinates){
        const {x,y}=initialCoordinates;
        selectionBoxStyle={...selectionBoxStyle,top:y,left:x};
      }
      if(currentCoordinates){
         const {x,y}=currentCoordinates;
          const {x:xs,y:ys}=initialCoordinates;
          selectionBoxStyle={...selectionBoxStyle,height:y-ys,width:x-xs};
      }
      setSelectionBoxStyle(selectionBoxStyle)
    }
    else{
      setSelectionBoxStyle({})
    }

  },[isMouseDown,initialCoordinates,currentCoordinates])

  const commonProps = { disabled,isMouseDown,initialCoordinates,currentCoordinates,onUnderRectangle };
  return (
    <div className="day-parting" style={{position:"relative"}} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
    <div style={selectionBoxStyle}></div>
      <div>
        <Row
          rowNo={0}
          name={"SUN"}
          onChange={onRowChange}
          values={value.slice(0, 24)}
          {...commonProps}
        />
      </div>
      <div>
        <Row
          rowNo={1}
          name={"MON"}
          onChange={onRowChange}
          values={value.slice(24, 48)}
          {...commonProps}
        />
      </div>
      <div>
        <Row
          rowNo={2}
          name={"TUE"}
          onChange={onRowChange}
          values={value.slice(48, 72)}
          {...commonProps}
        />
      </div>
      <div>
        <Row
          rowNo={3}
          name={"WED"}
          onChange={onRowChange}
          values={value.slice(72, 96)}
          {...commonProps}
        />
      </div>
      <div>
        <Row
          rowNo={4}
          name={"THU"}
          onChange={onRowChange}
          values={value.slice(96, 120)}
          {...commonProps}
        />
      </div>
      <div>
        <Row
          rowNo={5}
          name={"FRI"}
          onChange={onRowChange}
          values={value.slice(120, 144)}
          {...commonProps}
        />
      </div>
      <div>
        <Row
          rowNo={6}
          name={"SAT"}
          onChange={onRowChange}
          values={value.slice(144, 168)}
          {...commonProps}
        />
      </div>
    </div>
  );
}

export default function App() {
  let [value, setValue] = React.useState([
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1
  ]);
  function onChange(newValue) {
    //console.log(newValue)
    setValue(newValue);
  }
  return (
    <div className="App">
        <DayParting  value={value} onChange={onChange} />
    </div>
  );
}

