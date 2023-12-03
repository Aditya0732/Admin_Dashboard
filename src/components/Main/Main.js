import { useEffect, useState } from "react";
import EachRow from "../EachRow/EachRow";
import useHttp from "../../hooks/useHttp";
import styles from "./Main.module.css";
import ActionButton from "../ActionButton/ActionButton";
import { MdDeleteOutline } from "react-icons/md";
import { FaForwardStep } from "react-icons/fa6";
import { FaForwardFast } from "react-icons/fa6";
import { FaBackwardStep } from "react-icons/fa6";
import { FaBackwardFast } from "react-icons/fa6";

const Main = () => {
    // Custom hook to handle HTTP requests
    const { data: apiData, get, setData } = useHttp();
    const url = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

    // State variables
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState();
    const [selectedStates, setSelectedStates] = useState([]);
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [numOfSelectedRows,setNumOfSelectedRows] = useState(0);
    
    // Function to toggle isSelectedAll state
    const toggleIsSelectedAll = () => {
        setIsSelectedAll(!isSelectedAll);
    }

    // Function to handle selecting/deselecting all checkboxes
    const selectAllHandler = () => {
        // Logic to handle selecting/deselecting all checkboxes
        if (isSelectedAll) {
            const tempSelectedStates = [...selectedStates];
            for (let i = firstIndex; i < lastIndex; i++) {
                tempSelectedStates[i] = true;
            }
            setSelectedStates(tempSelectedStates);
        } else {
            const tempSelectedStates = [...selectedStates];
            for (let i = firstIndex; i < lastIndex; i++) {
                tempSelectedStates[i] = false;
            }
            setSelectedStates(tempSelectedStates);
        }
        
    }
    useEffect(()=>{
        var temp=0;
        for(var i=0;i<apiData?.length;i++)
        {
            if(selectedStates[i])
                temp++;
        }
        setNumOfSelectedRows(temp);
    },[selectedStates]);

    // Effect to reset isSelectedAll when currentPage changes
    useEffect(() => {
        setIsSelectedAll(false);
    }, [currentPage])

    // Effect to trigger selectAllHandler when isSelectedAll changes
    useEffect(() => {
        selectAllHandler();
    }, [isSelectedAll])

    // Function to handle checkbox selection
    const onSelectIndexHandler = (index) => {
        setSelectedStates((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    // Effect to fetch data from the API on component mount
    useEffect(() => {
        get({
            url
        });
    }, [])

    // Effect to update state variables when apiData changes
    useEffect(() => {
        if (apiData) {
            setFilteredData(apiData)
            setSelectedStates(new Array(apiData.length).fill(false));
        }
    }, [apiData])

    // State variable for editingRowIndex
    const [editingRowIndex, setEditingRowIndex] = useState(null);

    // Function to filter data based on search input
    const filterState = (event) => {
        if (event.key === 'Enter') {
            const searchInput = event.target.value;
            const tempFilteredData = apiData.filter(entry => {
                // Check if search input is present in any of the fields (name, email, role)
                return Object.values(entry).some(value =>
                    value.toString().toLowerCase().includes(searchInput.toLowerCase())
                );
            });
            setFilteredData(tempFilteredData);
        }
    }

    // Function to handle deletion of a row
    const onDeleteHandler = (id) => {
        const updatedData = [...apiData];
        updatedData.splice(id, 1);
        setData(updatedData);
    }

    // Function to handle deletion of multiple rows
    const onDeleteMultipleHandler = () => {
        const newApiData = apiData.filter((item, index) => !selectedStates[index]);
        console.log(newApiData);
        setData(newApiData);
        setIsSelectedAll(false)
    }

    // Function to handle editing a row
    const onEditHandler = (index) => {
        setEditingRowIndex(index);
    }

    // Function to handle saving changes to a row
    const onSaveHandler = (index, name, email, role) => {
        const updatedData = [...apiData];
        updatedData[index].name = name;
        updatedData[index].email = email;
        updatedData[index].role = role;
        setData(updatedData);
        setEditingRowIndex(null)
    }

    /* Pagination Logic */
    const recordsPerPage = 10;
    const firstIndex = currentPage * recordsPerPage - recordsPerPage;
    const lastIndex = currentPage * recordsPerPage;
    const npage = Math.ceil(filteredData?.length / recordsPerPage);
    const numbers = [];
    for (let i = 1; i <= npage; i++) {
        numbers.push(i);
    }

    // JSX for the component
    return (
        <div className={styles.main}>
            {/* Search input and delete button */}
            <div className={styles.search_button}>
                <input
                    type='text'
                    placeholder='Search...'
                    className={styles["search-icon"]}
                    onKeyDown={filterState}
                />
                <p className={styles.selectedRowsCount}>{numOfSelectedRows} of {apiData?.length} rows selected</p>
                <ActionButton
                className = {styles.delete_button}
                    text={<MdDeleteOutline size={25} color="red" />}
                    onClickHandler={() => onDeleteMultipleHandler()}
                />
            </div>

            {/* Table with rows */}
            <div className={styles.tableDiv}>
            <table>
                <tr>
                    {/* Checkbox column */}
                    <th key={Math.random()}>
                        <input type="checkbox" defaultChecked={isSelectedAll} onClick={() => toggleIsSelectedAll()} />
                    </th>
                    {/* Other columns */}
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                {/* Render EachRow component for each data entry */}
                {filteredData &&
                    (() => {
                        const result = [];
                        for (let ind = firstIndex; ind < lastIndex; ind++) {
                            const each = filteredData[ind];
                            if (!each) continue;
                            result.push(
                                <EachRow
                                    onSelectIndexHandler={onSelectIndexHandler}
                                    isSelected={selectedStates[ind]}
                                    onSaveHandler={onSaveHandler}
                                    editable={ind === editingRowIndex}
                                    onDeleteHandler={onDeleteHandler}
                                    onEditHandler={onEditHandler}
                                    key={ind}
                                    index={ind}
                                    data={each}
                                />
                            );
                        }
                        return result;
                    })()
                }
            </table>
            </div>
            {/* Pagination navigation */}
            <nav>
                <ul className={styles.pagination}>
                    <li className={styles.pageItem}>
                        <button className={styles.pageLink + " first-Page"} onClick={firstPage}>
                            <FaBackwardFast />
                        </button>
                    </li>
                    <li className={styles.pageItem}>
                        <button className={styles.pageLink + " previous-Page"} onClick={prePage}>
                            <FaBackwardStep />
                        </button>
                    </li>
                    {/* Display page numbers */}
                    {numbers.map((n, i) => (
                        <li className={`${styles.pageItem} ${currentPage === n ? styles.active : ''}`} key={i}>
                            <button className={styles.pageLink} onClick={() => setCurrentPage(n)}>{n}</button>
                        </li>
                    ))}

                    <li className={styles.pageItem}>
                        <button className={styles.pageLink +" next-page"} onClick={nextPage}>
                            <FaForwardStep />
                        </button>
                    </li>
                    <li className={styles.pageItem}>
                        <button className={styles.pageLink +" last-page"} onClick={lastPage}>
                            <FaForwardFast />
                        </button>
                    </li>
                </ul>
            </nav>
            <p className={styles.pageNumber}>Page {currentPage} of {npage}</p>
        </div>
    )
    function firstPage() {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }
    function lastPage() {
        if (currentPage !== npage) {
            setCurrentPage(npage);
        }
    }
    function prePage() {
        if (currentPage !== firstIndex && currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    function nextPage() {
        if (currentPage !== lastIndex && currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    }

}
export default Main;