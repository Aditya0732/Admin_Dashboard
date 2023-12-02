import ActionButton from "../ActionButton/ActionButton"

const EachRow=({data, onDeleteHandler, onEditHandler,index})=>{
return(
    <tr>
    <td><input type="checkbox"></input></td>
    <td>{data.id}</td>
        <td>{data.name}</td>
        <td>{data.email}</td>
        <td>{data.role}</td>
        <td>
            <ActionButton text="Edit" onClickHandler={onEditHandler}></ActionButton>
            <ActionButton text="Delete" onClickHandler={()=> onDeleteHandler(index)}></ActionButton>
        </td>
    </tr>
)
}

export default EachRow