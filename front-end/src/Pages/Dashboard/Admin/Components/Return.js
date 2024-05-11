import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import '../../Member/MemberDashboard.css'
import moment from "moment"
import { AuthContext } from '../../../../Context/AuthContext'
import { Select, Form, Button } from 'antd';
import TransController from '../../../../Controller/TransactionController';
import UserController from '../../../../Controller/UserController';
import BookController from '../../../../Controller/bookController';
import { TableContainer, TablePagination, Paper } from '@material-ui/core';
import io from 'socket.io-client';
const { Option } = Select;


function Return() {
    const socket = io('http://localhost:8888');
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                let transactions;
                // if (borrowerId === null) {
                transactions = await TransController.getAllTrans();
                // } else {
                //   transactions = await TransController.getTransByUser(borrowerId);
                // }

                const activeTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "True");
                setAllTransactionsTrue(activeTransactions);
                const falseTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "False");
                setAllTransactionsFalse(falseTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchData();     // Gọi fetchData để lấy dữ liệu

    }, []); // useEffect sẽ chỉ chạy một lần sau khi render lần đầu tiên
    const fetchUserTransactions = async (userId) => {
        try {
            const transactions = await TransController.getTransByUser(userId);
            console.log("user trans", transactions)
            const activeTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "True");
            setAllTransactionsTrue(activeTransactions);
            const falseTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "False");
            setAllTransactionsFalse(falseTransactions);
        } catch (error) {
            console.error('Error fetching user transactions:', error);
        }
    };
    // lay danh sach nguoi dung khong phai la admin
    useEffect(() => {
        const fetchData = async () => {

            try {
                const allUser = await UserController.getAllUsers();
                // Lọc danh sách các giao dịch có trạng thái là "Active"
                const Users = allUser.filter(user => user && user.isAdmin !== true);
                setAllMembers(Users); // Đặt danh sách các giao dịch "Active" vào state
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchData(); // Gọi fetchData để lấy dữ liệu

    }, []);
    const handleSelectUser = (userId) => {
        setBorrowerId(userId)
        fetchUserTransactions(userId);
    };
    const handleUpdateTransaction = async (transactionId) => {
        try {
            const data = {
                staff_edit: user._id,
                transactionStatus: "False"
            };
            // Gọi hàm updateTransaction từ TransController để cập nhật giao dịch
            const updatedTransaction = await TransController.updateTransaction(transactionId, data);
            const transactions = await TransController.getAllTrans();
            // } else {
            //   transactions = await TransController.getTransByUser(borrowerId);
            // }

            const activeTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "True");
            setAllTransactionsTrue(activeTransactions);
            const falseTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "False");
            setAllTransactionsFalse(falseTransactions);
            console.log('Transaction updated:', updatedTransaction);
            alert('cập nhật thành công 🎉');
            socket.emit('notifyChange');
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };



    const convertToIssue = async (transactionId) => {
        try {
            await axios.put(API_URL + "api/transactions/update-transaction/" + transactionId, {
                transactionType: "Issued",
                isAdmin: user.isAdmin
            })
            setExecutionStatus("Completed");
            alert("Chuyển trạng thái 'Đã mượn' thành công 🎆")
        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <div>
            <div className='semanticdropdown returnbook-dropdown'>
                <Form
                    label="Độc giả"
                    name="borrowerId"
                    rules={[{ required: true, message: 'Vui lòng chọn độc giả' }]}
                    labelStyle={{ fontSize: '20px' }} // Thêm style cho nhãn
                >
                    <Select
                        placeholder="Chọn độc giả"
                        onChange={handleSelectUser}
                        style={{ fontSize: '16px' }}
                        // Thêm style cho Select component
                        showSearch  // Thêm tính năng tìm kiếm
                        optionFilterProp="children" // Chỉ định thuộc tính cần tìm kiếm trong các option
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {allMembers.map(member => (
                            <Option key={member._id} value={member._id}>{member.userFullName}</Option>
                        ))}
                    </Select>


                </Form>
            </div>
            <p className="dashboard-option-title">Đã mượn</p>
            {/* <table className="admindashboard-table">
                <tr>
                    <th>Tên sách</th>
                    <th>Người mượn</th>
                    <th>Từ ngày</th>
                    <th>Đến ngày</th>
                    <th>Quá hạn</th>
                    <th></th>
                </tr>
                {Array.isArray(allTransactionsTrue) && allTransactionsTrue.length > 0 ? (
                    allTransactionsTrue.map((data, index) => (
                        <tr key={index}>
                            <td>{data ? data.books : "N/A"}</td>
                            <td>{data ? data.userName : "N/A"}</td>
                            <td>{data ? data.fromDate : "N/A"}</td>
                            <td>{data ? data.toDate : "N/A"}</td>
                            <td>{data ? data.overdue : "N/A"}</td>

                            <td>
                                <button onClick={() => handleUpdateTransaction(data._id)}>
                                    Trả sách
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">Không có giao dịch nào được tìm thấy</td>
                    </tr>
                )}
            </table> */}
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
                                    <th></th>
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

                                        <td>
                                            <Button type="primary" onClick={() => handleUpdateTransaction(data._id)}>
                                                Trả sách
                                            </Button>
                                        </td>
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

export default Return
