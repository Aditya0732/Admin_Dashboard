const ActionButton=(props)=>{
    return <button className={props.className} onClick={props.onClickHandler}>
    {props.text}
    </button>
}

export default ActionButton;