import React from 'react'

const Box = (props) => {
    const {value,title,draggable,onDragStart,onClick,cancellable,onDragEnter,onRemove}=props;
    let operator=['+','-','*','/','<','>','RHS Integer'];
    let color,height,width;
    if(operator.includes(title)){
        color="red"
        height="50px";
        width="100px";
    }else{
        color="green";
        height="100px";
        width="100px";
    }
    const style={
        position:"relative",
        background:(title==="RHS")?"tomato":color,
        width:width,
        height:height,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        margin:"10px",
        padding:"10px",
        cursor:(draggable) ?"move":"pointer",
        flexGrow:0,
        flexShrink:0,
        fontWeight:"bold"
    }

    const remove={
        color: "#fff",
        height: "15px",
        position: "absolute",
        right: "10px",
        top: "10px",
        width: "15px",
    }
    return (
        <div onClick={onClick} onDragEnter={onDragEnter} onDragStart={onDragStart} style={style} data-value={value} draggable={draggable}>
            {title==="RHS"?value:title}
            {
                cancellable && <span onClick={onRemove} style={remove}>x</span>
            }
        </div>
    )
}

export default Box