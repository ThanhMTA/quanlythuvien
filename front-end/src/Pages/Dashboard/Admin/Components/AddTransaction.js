import React, { useContext, useEffect, useState } from 'react';
import { Select, DatePicker, Table, Typography, Button, Form, Row, Col, message } from 'antd';
import axios from 'axios';
import { AuthContext } from '../../../../Context/AuthContext';
import moment from 'moment';
import Loading from '../../../../Components/Loader/Loader';
import TransController from '../../../../Controller/TransactionController';
import UserController from '../../../../Controller/UserController';
import BookController from '../../../../Controller/bookController';
import io from 'socket.io-client';

import {
  Paper,
  TableContainer,
  TablePagination
} from "@mui/material"
// import "./adtransaction.css"

const { Option } = Select;
const { Title } = Typography;

function AddTransaction() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [borrowerId, setBorrowerId] = useState('');
  const [bookIds, setBookIds] = useState([]);

  const [transactionType, setTransactionType] = useState('');
  const [toDate, setToDate] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [fromDate, setFromDate] = useState(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);





  const transactionTypes = [
    { value: 'Reserved', text: 'Đặt trước' },
    { value: 'Issued', text: 'Mượn luôn' },
  ];
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

        const activeTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "Active");
        setAllTransactions(activeTransactions);
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
      const activeTransactions = transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "Active");
      setAllTransactions(activeTransactions);
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
  // lấy tất cả cuốn sách 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBooks = await BookController.getAllBooks();
        setAllBooks(allBooks);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData(); // Gọi fetchData để lấy dữ liệu

  }, []);
  const handleBookSelection = selectedBooks => {
    setBookIds(selectedBooks);
  };
  const handleSelectUser = (userId) => {
    setBorrowerId(userId)
    fetchUserTransactions(userId);
  };


  const socket = io('http://localhost:8888');


  const addTransaction = async (values) => {
    try {
      setIsLoading(true);

      // Extracting form values
      const { borrowerId, bookIds, transactionType, fromDate, toDate } = values;


      const transactionData = {
        books: bookIds,
        borrowerId: borrowerId,
        transactionType: transactionType,
        fromDate: fromDate,
        toDate: toDate,
        returnDate: null
        // isAdmin: user.isAdmin,
      };

      // Adding transaction
      await TransController.addTransaction(transactionData);
      const Transactions = await TransController.getAllTrans();

      // Lọc danh sách các giao dịch có trạng thái là "Active"
      // const activeTransactions = allTransactions.filter(transaction => transaction && transaction.transactionStatus === "Active");
      const activeTransactions = Transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "Active");
      console.log("Transactions", Transactions)

      setAllTransactions(activeTransactions);
      // Alerting success message
      alert('Tạo phiếu mượn thành công 🎉');
      //   } else {
      //     alert('Cuốn sách này đã hết hoặc không phù hợp loại giao dịch');
      //   }
      // } else {
      //   alert('Vui lòng điền đầy đủ thông tin');
      // }
      socket.emit('notifyChange');
    } catch (err) {
      console.log(err);
      alert('Đã xảy ra lỗi khi tạo phiếu mượn');
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateTransaction = async (transactionId) => {
    try {
      const data = {
        staff_creat: user._id,
        transactionStatus: "True"
      };
      // Gọi hàm updateTransaction từ TransController để cập nhật giao dịch
      const updatedTransaction = await TransController.updateTransaction(transactionId, data);
      const Transactions = await TransController.getAllTrans();

      // Lọc danh sách các giao dịch có trạng thái là "Active"
      // const activeTransactions = allTransactions.filter(transaction => transaction && transaction.transactionStatus === "Active");

      console.log('Transaction updated:', updatedTransaction);
      alert('cập nhật thành công 🎉');
      socket.emit('notifyChange');
      const activeTransactions = Transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "Active");
      console.log("thanh", Transactions)

      setAllTransactions(activeTransactions);

      const allBooks = await BookController.getAllBooks();
      setAllBooks(allBooks);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };


  if (isLoading) return <Loading />;

  return (
    <div>
      <Title level={2}>Tạo phiếu mượn sách</Title>
      {/* Form for adding transaction */}
      <Form
        // form={form}
        onFinish={addTransaction}
        layout="vertical"
        style={{ margin: 33, }}

      >
        <Row gutter={14}>
          <Col span={11}>
            <Form.Item
              label="Độc giả"
              name="borrowerId"
              rules={[{ required: true, message: 'Vui lòng chọn độc giả' }]}
              labelStyle={{ fontSize: '20px' }} // Thêm style cho nhãn
            >
              <Select
                placeholder="Chọn độc giả"
                onChange={handleSelectUser}
                style={{ fontSize: '16px' }} // Thêm style cho Select component
                showSearch  // Thêm tính năng tìm kiếm
                optionFilterProp="children" // Chỉ định thuộc tính cần tìm kiếm trong các option
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } // Hàm tìm kiếm tùy chỉnh
              >
                {allMembers.map(member => (
                  <Option key={member._id} value={member._id}>{member.userFullName}</Option>
                ))}
              </Select>


            </Form.Item>
            <Form.Item label="Tên sách" name="bookIds" rules={[{ required: true, message: 'Vui lòng chọn sách' }]}>
              <Select placeholder="Chọn sách" onChange={handleBookSelection}
                showSearch  // Thêm tính năng tìm kiếm
                optionFilterProp="children" // Chỉ định thuộc tính cần tìm kiếm trong các option
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {allBooks.map(book => (
                  <Option key={book._id} value={book._id}>{book.bookName} : {book.bookCountAvailable}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Loại mượn" name="transactionType" rules={[{ required: true, message: 'Vui lòng chọn loại mượn' }]}>
              <Select placeholder="Chọn loại mượn" onChange={setTransactionType}
                showSearch  // Thêm tính năng tìm kiếm
                optionFilterProp="children" // Chỉ định thuộc tính cần tìm kiếm trong các option
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {transactionTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.text}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>

            <Form.Item label="Từ ngày" name="fromDate" rules={[{ required: true, message: 'Vui lòng chọn từ ngày' }]}>
              <DatePicker style={{ width: 520 }} placeholder="Chọn từ ngày" onChange={date => setFromDate(date)} />
            </Form.Item>
            <Form.Item label="Đến ngày" name="toDate" rules={[{ required: true, message: 'Vui lòng chọn đến ngày' }]}>
              <DatePicker style={{ width: 520 }} placeholder="Chọn đến ngày" onChange={date => setToDate(date)} />
            </Form.Item>
          </Col>

        </Row>

        <Form.Item
          style={{
            paddingTop: 24,
          }}
        >
          <Button type="primary" htmlType="submit" loading={isLoading}>Tạo</Button>
        </Form.Item>
      </Form>

      {/* Table showing recent transactions */}

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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.books || "N/A"}</td>
                    <td>{transaction.userName || "N/A"}</td>
                    <td>{transaction.fromDate || "N/A"}</td>
                    <td>{transaction.toDate || "N/A"}</td>
                    <td>
                      <Button type="primary" onClick={() => handleUpdateTransaction(transaction._id)}>
                        Cho mượn
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

  );
}

export default AddTransaction;
