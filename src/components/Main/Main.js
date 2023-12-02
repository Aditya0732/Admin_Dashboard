import { useEffect, useState } from "react";
import EachRow from "../EachRow/EachRow";
import useHttp from "../../hooks/useHttp";
import styles from "./Main.module.css"

const Main = () => {
    const { data: apiData, get, setData } = useHttp();
    const url = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        console.log("!!")
        get({
            url
        })
    },[currentPage])
    const [editingRowId, setEditingRowId] = useState(null);
    
    const onDeleteHandler = (id) => {
        // console.log("onDeleteHandler",id);
        const updatedData = [...apiData];
        updatedData.splice(id, 1);
        setData(updatedData);
    }
    const onEditHandler = (id) => {
        console.log("onEditHandler");
    }
    const recordsPerPage = 10;
    const firstIndex = currentPage*recordsPerPage - recordsPerPage;
    const lastIndex = currentPage*recordsPerPage;
    const records = apiData?.slice(firstIndex, lastIndex);
    const npage = Math.ceil(apiData?.length / recordsPerPage);
    const numbers = [];
    for (let i = 1; i <= npage; i++) {
        numbers.push(i);
    }

    return (
        <div className={styles.main}>
            <table>
                <tr>
                    <th><input type="checkbox"></input></th>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>

                {records && records.map((each, ind) => {
                    return (
                        <EachRow onDeleteHandler={onDeleteHandler} onEditHandler={onEditHandler} key={ind} index={ind} data={each}></EachRow>
                    )
                })}
            </table>
            <nav>
                <ul className={styles.pagination}>
                    <li className={styles.pageItem}>
                        <a href="#" className={styles.pageLink} onClick={firstPage}>
                            First-Page
                        </a>
                    </li>
                    <li className={styles.pageItem}>
                        <a href="#" className={styles.pageLink} onClick={prePage}>
                            Prev
                        </a>
                    </li>
                    {
                        numbers.map((n, i) => (
                            <li className={`styles.pageItem ${currentPage === n ? 'active' : ''}`} key={i}>
                                <a href="#" className={styles.pageLink} onClick={()=>setCurrentPage(n)}>{n}</a>
                            </li>
                        ))
                    }
                    <li className={styles.pageItem}>
                        <a href="#" className={styles.pageLink} onClick={nextPage}>
                            Next
                        </a>
                    </li>
                    <li className={styles.pageItem}>
                        <a href="#" className={styles.pageLink} onClick={lastPage}>
                            Last-Page
                        </a>
                    </li>
                </ul>
            </nav>
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
        if (currentPage !== firstIndex && currentPage !==1) {
            setCurrentPage(currentPage - 1);
        }
    }
    function changePage(id) {
        setCurrentPage(id);
    }
    function nextPage() {
        if (currentPage !== lastIndex && currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    }
}
export default Main;