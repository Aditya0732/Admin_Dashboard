import { useState } from "react";
import ActionButton from "../ActionButton/ActionButton";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import styles from "./EachRow.module.css";

const EachRow = ({ data, onDeleteHandler, onEditHandler, index, editable, onSaveHandler, onSelectIndexHandler, isSelected }) => {
    // State variables for input values
    const [name, setName] = useState(data.name);
    const [email, setEmail] = useState(data.email);
    const [role, setRole] = useState(data.role);

    // If row is not in edit mode
    if (!editable)
        return (
            <tr className={isSelected ? `${styles.selected}` : ''} key={Math.random()}>
                {/* Checkbox for row selection */}
                <td><input type="checkbox" defaultChecked={isSelected ? true : false} onClick={() => onSelectIndexHandler(index)}></input></td>
                {/* Display data fields */}
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.role}</td>
                {/* Action buttons for edit and delete */}
                <td>
                    <ActionButton className="edit" text={<FaEdit size={17} color="black" />} onClickHandler={() => onEditHandler(index)}></ActionButton>
                    <ActionButton className="delete" text={<MdDeleteOutline size={17} color="red" />} onClickHandler={() => onDeleteHandler(index)}></ActionButton>
                </td>
            </tr>
        );
    else {
        // If row is in edit mode
        return (
            <tr>
                {/* Checkbox for row selection (editable mode) */}
                <td><input type="checkbox"></input></td>
                {/* Input fields for editing data */}
                <td><input type="text" value={name} onChange={(e) => setName(e.target.value)}></input></td>
                <td><input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input></td>
                <td><input type="text" value={role} onChange={(e) => setRole(e.target.value)}></input></td>
                {/* Action buttons for save and delete */}
                <td>
                    <ActionButton className="save" text={<FaSave size={17} />} onClickHandler={() => onSaveHandler(index, name, email, role)}></ActionButton>
                    <ActionButton className="delete" text={<MdDeleteOutline size={17} color="red" />} onClickHandler={() => onDeleteHandler(index)}></ActionButton>
                </td>
            </tr>
        );
    }
};

export default EachRow;
