import React, { useContext, useEffect, useState } from 'react'
import "../Admin/AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import './MemberDashboard.css'
import moment from "moment"
import { AuthContext } from '../../../Context/AuthContext.js'
import { Select, Form } from 'antd';
import TransController from '../../../Controller/TransactionController.js';
import UserController from '../../../Controller/UserController.js';
import BookController from '../../../Controller/bookController.js';
import {
    Paper,
    TableContainer,
    TablePagination
} from "@mui/material"
const { Option } = Select;


function Transaction() {

    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext)

    const [allTransactions, setAllTransactions] = useState([])
    const [ExecutionStatus, setExecutionStatus] = useState(null) /* For triggering the tabledata to be updated */
    const [allMembers, setAllMembers] = useState([]);
    const [borrowerId, setBorrowerId] = useState(null)
    const [allTransactionsTrue, setAllTransactionsTrue] = useState([])
    const [allTransactionsFalse, setAllTransactionsFalse] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // lay danh sach transaction chua xu ly
    // useEffect sẽ chỉ chạy một lần sau khi render lần đầu tiên

    // lay danh sach nguoi dung khong phai la admin
    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactions = await TransController.getTransByUser(user._id);
                console.log("user trans", transactions)
                const activeTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "Active");
                setAllTransactions(activeTransactions);
                const TrueTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "True");
                setAllTransactionsTrue(TrueTransactions);
                const falseTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "False");
                setAllTransactionsFalse(falseTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchData();     // Gọi fetchData để lấy dữ liệu

    }, []);


    return (
        <div>
            <p className="dashboard-option-title">Chờ xử lý</p>
            {allTransactions.length > 0 ? (
                <>
                    <TableContainer component={Paper} style={{ maxWidth: '1160px' }}>

                        <table className="admindashboard-table">
                            <thead>
                                <tr>
                                    <th>Tên sách</th>
                                    <th>Người mượn</th>
                                    <th>Từ ngày</th>
                                    <th>Đến ngày</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.books || "N/A"}</td>
                                        <td>{transaction.userName || "N/A"}</td>
                                        <td>{transaction.fromDate || "N/A"}</td>
                                        <td>{transaction.toDate || "N/A"}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContainer>

                    <TablePagination
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10))
                            setPage(0)
                        }}
                        component="div"
                        count={allTransactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        style={{ maxWidth: '1160px' }}
                    />
                </>
            ) : (
                <table className="admindashboard-table">
                    <thead>

                        <tr>
                            <th>Tên sách</th>
                            <th>Người mượn</th>
                            <th>Từ ngày</th>
                            <th>Đến ngày</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="5">Không có giao dịch nào được tìm thấy</td>
                        </tr>
                    </tbody>
                </table>
            )}

            <p className="dashboard-option-title">Đang Mượn</p>

            {allTransactionsTrue.length > 0 ? (
                <>
                    <TableContainer component={Paper} style={{ maxWidth: '1160px' }}>

                        <table className="admindashboard-table">
                            <thead>
                                <tr>
                                    <th>Tên sách</th>
                                    <th>Người mượn</th>
                                    <th>Từ ngày</th>
                                    <th>Đến ngày</th>
                                    <th>Quá hạn</th>

                                </tr>
                            </thead>
                            <tbody>
                                {allTransactionsTrue.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                                    <tr key={index}>
                                        <td>{data ? data.books : "N/A"}</td>
                                        <td>{data ? data.userName : "N/A"}</td>
                                        <td>{data ? data.fromDate : "N/A"}</td>
                                        <td>{data ? data.toDate : "N/A"}</td>
                                        <td>{data ? data.overdue : "N/A"}</td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContainer>
                    <TablePagination
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10))
                            setPage(0)
                        }}
                        component="div"
                        count={allTransactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        style={{ maxWidth: '1160px' }}
                    />
                </>
            ) : (
                <table className="admindashboard-table">
                    <thead>
                        <tr>
                            <th>Tên sách</th>
                            <th>Người mượn</th>
                            <th>Từ ngày</th>
                            <th>Đến ngày</th>
                            <th>Quá hạn</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="5">Không có giao dịch nào được tìm thấy</td>
                        </tr>
                    </tbody>
                </table>
            )}
            <p className="dashboard-option-title">Lịch Sử</p>
            {allTransactionsFalse.length > 0 ? (
                <>
                    <TableContainer component={Paper} style={{ maxWidth: '1160px' }}>

                        <table className="admindashboard-table">
                            <thead>
                                <tr>
                                    <th>Tên sách</th>
                                    <th>Người mượn</th>
                                    <th>Từ ngày</th>
                                    <th>Đến ngày</th>
                                    <th>Quá hạn</th>

                                </tr>
                            </thead>
                            <tbody>
                                {allTransactionsFalse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                                    <tr key={index}>
                                        <td>{data ? data.books : "N/A"}</td>
                                        <td>{data ? data.userName : "N/A"}</td>
                                        <td>{data ? data.fromDate : "N/A"}</td>
                                        <td>{data ? data.toDate : "N/A"}</td>
                                        <td>{data ? data.overdue : "N/A"}</td>



                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContainer>
                    <TablePagination
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10))
                            setPage(0)
                        }}
                        component="div"
                        count={allTransactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        style={{ maxWidth: '1160px' }}
                    />
                </>
            ) : (
                <table className="admindashboard-table">
                    <thead>

                        <tr>
                            <th>Tên sách</th>
                            <th>Người mượn</th>
                            <th>Từ ngày</th>
                            <th>Đến ngày</th>
                            <th>Quá hạn</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="5">Không có giao dịch nào được tìm thấy</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Transaction
