import React, { useEffect, useRef, useState } from 'react'
import Box from './components/Box'
import "./App.css"
import axios from 'axios';
const App = () => {
  const [getEval,setEval]=useState([]);
  const [operand,setOperand]=useState([]);
  const dragIndex=useRef(null);

  useEffect(()=>{
   fetchData();
  },[]);
  const fetchData=async()=>{
    try{
      const result=await axios("https://evalbackend.herokuapp.com/");
      setOperand(result.data);
    }catch(err){
      console.log(err);
    }
  }
  // let operand=[{"title":"a","value":1},{"title":"b","value":2},{"title":"c","value":3},{"title":"d","value":4},{"title":"e","value":5},{"title":"f","value":6}];

  let operator=[{"title":"+","value":"+"},{"title":"-","value":"-"},{"title":"*","value":"*"},{"title":"/","value":"/"}];

  const dragStart=(e,index,type)=>{
    e.dataTransfer.setData("index",index);
    e.dataTransfer.setData("type",type);
  }

  const drop=(e)=>{
    let index=e.dataTransfer.getData("index");
    let type=e.dataTransfer.getData("type");
    let obj=operator[index];;
    if(type==="operand"){
      obj=operand[index];
    }

    const copyList=[...getEval];
    let fixedSpace=0;
    copyList.forEach((element)=>{
      if(element.title===">" || element.title ==='<' || element.title ==="RHS"){
        fixedSpace++;
      }
    })
    console.log(fixedSpace);

    if(dragIndex.current!=null){
      if(dragIndex >= copyList.length-fixedSpace){
        copyList.splice(copyList.length-fixedSpace,0,obj);
      }else{
        copyList.splice(dragIndex.current,0,obj);
      }
    }else{
      if(fixedSpace){
        copyList.splice(copyList.length-fixedSpace,0,obj);
      }else{
        copyList.push(obj);
      }
    }
    
    dragIndex.current=null;
    setEval(copyList);
    
  }

  const click=(e,value)=>{
    const copyList=[...getEval];
    let index=copyList.findIndex((element)=>{
      if(element.title ==="<" || element.title === ">"){
        return true;
      }
      return false;
    })
    if(index===-1){
      copyList.push({"title":value,value});
    }else{
      copyList[index]={"title":value,value};
    }
    setEval(copyList);
    
  }

  const dragEnter=(e,index)=>{
    dragIndex.current=index;
  }

  const handleRHS=(e)=>{
    let rhs=prompt("Enter RHS Integer");
    if(!rhs){
      return;
    }

    const copyList=[...getEval];
    let index=copyList.findIndex((element)=>{
      if(element.title ==="RHS"){
        return true;
      }
      return false;
    })
    if(index===-1){
      copyList.push({"title":"RHS","value":rhs});
    }else{
      copyList[index]={"title":"RHS","value":rhs};
    }
    setEval(copyList);
  

  }



  const evaluate=(e)=>{
    let currentList=[...getEval];
    let res="";
    let operator=['+','-','*','/','<','>','RHS'];
    for(let i=1;i<currentList.length;i++){
      let x=currentList[i-1];
      let y=currentList[i];

      if(!operator.includes(x.title) && !operator.includes(y.title)){
        alert("This is not a valid equation");
        return;
      }

    }
    
    currentList.forEach((element)=>{
      res+=element.value;
    })
    let ans;
    try{
      ans=eval(res);
    }catch(e){
      alert("This is not a valid equation");
      return;
    }
    alert(ans);
    
  }
  const remove=(e,index)=>{
    let currentList=[...getEval];
    currentList.splice(index,1);
    setEval(currentList);
  }
  return (
    <div id="App">

        <div className="container">
            {
              operand.map((element,index)=>{
                return <Box onDragStart={(e)=>dragStart(e,index,"operand")} key={index}  value={element.value} title={element.title} draggable={true}/>
              })
            }
        </div>

        <div className="container">
            {
              operator.map((element,index)=>{
                return <Box onDragStart={(e)=>dragStart(e,index,"operator")} key={index}  value={element.value} title={element.title} draggable={true}/>
              })

            }
            <span className='space'></span>
            <Box onClick={(e)=>click(e,"<")} value="<" title="<"  />
            <Box onClick={(e)=>click(e,">")} value=">" title=">"  />
            <span className='space'></span>
            <Box onClick={handleRHS} value="RHS Integer" title="RHS Integer" />
        </div>

        <div id="evalContainer" onDragOver={(e)=>e.preventDefault()} onDrop={drop} >
            {
              getEval.map((element,index)=>{
                return <Box key={index} onRemove={(e)=>remove(e,index)} onDragEnter={(e)=>dragEnter(e,index)} cancellable={true} value={element.value} title={element.title} />
              })
            }
        </div>

        <button onClick={evaluate}>Evaluate</button>

    </div>
  )
}

export default App