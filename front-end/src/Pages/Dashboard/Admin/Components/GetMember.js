import React, { useEffect, useState, useContext } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import '../../Member/MemberDashboard.css'
import TransController from '../../../../Controller/TransactionController';
import UserController from '../../../../Controller/UserController';
import BookController from '../../../../Controller/bookController';
import moment from "moment"
import { AuthContext } from '../../../../Context/AuthContext';
import io from 'socket.io-client';
// import moment from 'moment';
import { Select, DatePicker, Button, Form, Row, Col, message, Space, Modal, Input, Popconfirm } from 'antd';
import {

    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    CardActions,
    Typography,
    TablePagination
} from "@mui/material"
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import Loading from "../../../../Components/Loader/Loader";
const { Option } = Select;

function GetMember() {
    const { user } = useContext(AuthContext);

    const API_URL = process.env.REACT_APP_API_URL
    const [form] = Form.useForm();
    const [allMembersOptions, setAllMembersOptions] = useState([])
    const [member, setMember] = useState(null)
    const [memberId, setMemberId] = useState(null)

    const [memberDetails, setMemberDetails] = useState(null)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [allUsers, setAllUsers] = useState([]);
    const [allTransactions, setAllTransactions] = useState([])
    const [allTransactionsTrue, setAllTransactionsTrue] = useState([])
    const [allTransactionsFalse, setAllTransactionsFalse] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [activeBookID, setActiveBookID] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [file, setFile] = useState();
    const [imageURL, setImageURL] = useState("");
    const socket = io('http://localhost:8888');
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 20,

        },
    }));
    const handleOk = () => {
        setIsModalOpen(false);
        setIsModalOpenDelete(false)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalOpenDelete(false)
        setIsModalEditOpen(false); // Hiển thị Modal


    };
    function handleChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
            setImageURL(imageUrl);
        }
    }
    const showEditModal = (record) => {

        form.setFieldsValue({
            _id: record._id,
            userType: record.userType,
            // photo: record.photo,
            userFullName: record.userFullName,
            // age: record.age,
            gender: record.gender, // Kiểm tra xem tên trường có đúng không
            dob: moment(record.dob, 'DD/MM/YYYY'),
            address: record.address,
            mobileNumber: record.mobileNumber,
            email: record.email,
            // password: record.password,

        });
        if (record.photo) {
            setImageURL(record.photo);
        }
        setIsModalEditOpen(true); // Hiển thị Modal
    };
    const updateUser = async (member) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            // formData.append('image', file);
            formData.append('userType', member.userType);
            formData.append('userFullName', member.userFullName);
            formData.append('gender', member.gender);
            formData.append(' dob', member.dob);
            formData.append('address', member.address);
            formData.append('mobileNumber', member.mobileNumber);
            formData.append('email', member.email);
            formData.append('password', member.password);
            // formData.append('memberCount', member.memberCount);
            // formData.append('staff_edit', user.user._id);
            // const response = await bookController.updateBook(book._id,formData);
            // Use fetch to send a PUT request

            const response = await fetch(`http://localhost:5000/api/users/updateuser/${member._id}`, {
                method: 'PUT',
                body: formData
            });

            console.log('update nguoi dung', member)
            // Assuming the update is successful, notify the user
            alert('Cập nhật thành công 🎉');
            const users = await UserController.getAllUsers();
            //         const updatedBooks = await bookController.getAllBooks();
            setAllUsers(users)
            // Assuming the server returns the updated book data, you might not need these lines
            // const updatedTransaction = await response.json();
            // const updatedBooks = await bookController.getAllBooks();
            // setBooks(updatedBooks);
        } catch (error) {
            console.error('Error updating book:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // const updateUser = async () => {
    //     try {
    //         setIsLoading(true);
    //         const formData = new FormData();
    //         const formValues = form.getFieldsValue();
    //         for (const [key, value] of Object.entries(formValues)) {
    //             formData.append(key, value);
    //         }
    //         const response = await fetch(`http://localhost:5000/api/users/updateuser/${formValues._id}`, {
    //             method: 'PUT',
    //             body: formData,
    //         });

    //         console.log('update nguoi dung', formValues);
    //         alert('Cập nhật thành công 🎉');
    //         const users = await UserController.getAllUsers();
    //         setAllUsers(users);
    //     } catch (error) {
    //         console.error('Error updating user:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleOkModal = () => {
        const formData = form.getFieldsValue();
        console.log("user update", formData)
        updateUser(formData)
        setIsModalEditOpen(true); // Hiển thị Modal

    };
    const showModal = (record) => {

        // form.setFieldsValue({
        //     // _id: record._id,
        //     language: record.language,
        //     image_url: record.image_url,
        //     publisher: record.publisher,
        //     description: record.description,
        //     categories: record.categories, // Kiểm tra xem tên trường có đúng không
        //     bookName: record.bookName,
        //     author: record.author,
        //     bookCountAvailable: record.bookCountAvailable,
        //     bookCount: record.bookCount
        // });
        // if (record.image_url) {
        //     // setImageURL(record.image_url);
        // }
        setIsModalOpen(true); // Hiển thị Modal
    };
    const fetchBooks = async () => {
        const response = await axios.get(API_URL + "api/books/allbooks")
        // setBooks(response.data);
        // setLoading(false);
        console.log("book", response.data)

    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactions = await TransController.getTransByUser(memberDetails._id);
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allUser = await UserController.getAllUsers();
                // Lọc danh sách các giao dịch có trạng thái là "Active"
                const Users = allUser.filter(user => user && user.isAdmin !== true);
                setAllUsers(Users);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchData();     // Gọi fetchData để lấy dữ liệu

    }, []);
    //Fetch Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/users/allmembers")
                setAllMembersOptions(response.data.map((member) => (
                    { value: `${member?._id}`, text: `${member?.userType === "Student" ? `${member?.userFullName}[${member?.admissionId}]` : `${member?.userFullName}[${member?.employeeId}]`}` }
                )))
            }
            catch (err) {
                console.log(err)
            }
        }
        getMembers()
    }, [API_URL])


    useEffect(() => {
        const getMemberDetails = async () => {
            if (memberId !== null) {
                try {
                    const response = await axios.get(API_URL + "api/users/getuser/" + memberId)
                    setMemberDetails(response.data)
                }
                catch (err) {
                    console.log("Error in fetching the member details")
                }
            }
        }
        getMemberDetails()
    }, [API_URL, memberId])

    if (loading) return <Loading />;

    return (
        <div>
            <Space align='center'>
                <p className="dashboard-option-title">Danh sách người dùng</p>
                <Button
                    variant="contained"
                    // component={RouterLink}
                    size="small"
                    onClick={() => showModal()}
                >
                    Thêm
                </Button>
            </Space>
            <>
                {allUsers.length > 0 ? (
                    <>
                        <div className="tableContainer">
                            <TableContainer component={Paper} style={{ maxWidth: '1160px' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>STT</StyledTableCell>
                                            <StyledTableCell>Họ và tên </StyledTableCell>
                                            <StyledTableCell>Ngày sinh </StyledTableCell>
                                            <StyledTableCell>Địa chỉ </StyledTableCell>
                                            <StyledTableCell>Đối tượng</StyledTableCell>
                                            <StyledTableCell>Hành động</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? allUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : allUsers
                                        )
                                            .map((users, index) => (
                                                <TableRow key={users.isbn}>
                                                    <TableCell >
                                                        {/* <Image width={50} className="image-table" src={users.image_url} alt="" />?\ */}
                                                        {page * 7 + index + 1}
                                                    </TableCell>
                                                    <TableCell align="left" >{users.userFullName}</TableCell>
                                                    <TableCell align="left" >{users.dob}</TableCell>
                                                    <TableCell>{users.address}</TableCell>
                                                    <TableCell align="left">{users.userType}</TableCell>
                                                    <TableCell align="left" >
                                                        <div className="actionsContainer">
                                                            <Button
                                                                variant="contained"
                                                                // component={RouterLink}
                                                                size="small"
                                                                onClick={() => showEditModal(users)}
                                                            >
                                                                Xem
                                                            </Button>
                                                            {user.isAdmin && (
                                                                <>
                                                                    <Button
                                                                        variant="contained"
                                                                        type="primary"
                                                                        // component={RouterLink}
                                                                        size="small"
                                                                        // to={`/admin/users/${users._id}/edit`}
                                                                        onClick={() => showEditModal(users)}
                                                                    >
                                                                        Sửa
                                                                    </Button>
                                                                    <Popconfirm
                                                                        title="Xóa sách"
                                                                        description="Bạn thực sự muốn xóa!!!"
                                                                        // onConfirm={() => confirm(users._id)}
                                                                        // onCancel={cancel}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <Button variant="contained"
                                                                            type="primary"
                                                                            // component={RouterLink}
                                                                            size="small" danger>Xóa</Button>
                                                                    </Popconfirm>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10))
                                    setPage(0)
                                }}
                                component="div"
                                count={allUsers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                style={{ maxWidth: '1160px' }}
                            />

                        </div>
                    </>
                ) : (
                    <Typography variant="h5">No books found!</Typography>
                )}


            </>


            <div className='semanticdropdown getmember-dropdown'>

                <Form.Item
                    label="Độc giả"
                    name="borrowerId"
                    rules={[{ required: true, message: 'Vui lòng chọn độc giả' }]}
                    labelStyle={{ fontSize: '20px' }} // Thêm style cho nhãn
                >
                    <Select
                        placeholder="Chọn độc giả"
                        onChange={setMemberId}
                        style={{ fontSize: '16px' }} // Thêm style cho Select component
                    >
                        {allMembersOptions.map(member => (
                            <Option key={member.value} value={member.value}>{member.text}</Option>
                        ))}
                    </Select>


                </Form.Item>
            </div>
            <div style={memberId === null ? { display: "none" } : {}}>
                <div className="member-profile-content" id="profile@member" style={memberId === null ? { display: "none" } : {}}>
                    <div className="user-details-topbar" >
                        <img className="user-profileimage" src="./assets/images/Profile.png" alt=""></img>
                        <div className="user-info">
                            <p className="user-name">{memberDetails?.userFullName}</p>
                            <p className="user-id">{memberDetails?.userType === "Student" ? memberDetails?.admissionId : memberDetails?.employeeId}</p>
                            <p className="user-email">{memberDetails?.email}</p>
                            <p className="user-phone">{memberDetails?.mobileNumber}</p>
                        </div>
                    </div>
                    <div className="user-details-specific">
                        <div className="specific-left">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>Tuổi</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.age}
                                    </span>
                                </p>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>Giới tính</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.gender}
                                    </span>
                                </p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>Ngày sinh</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.dob}
                                    </span>
                                </p>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>Địa chỉ</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.address}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="specific-right">
                            <div style={{ display: "flex", flexDirection: "column", flex: "0.5" }}>
                                <p style={{ fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}><b>Điểm tích lũy</b></p>
                                <p style={{ fontSize: "25px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>540</p>
                            </div>
                            <div className="dashboard-title-line"></div>
                            <div style={{ display: "flex", flexDirection: "column", flex: "0.5" }}>
                                <p style={{ fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}><b>Thứ hạng</b></p>
                                <p style={{ fontSize: "25px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>{memberDetails?.points}</p>
                            </div>
                        </div>
                    </div>
                </div>

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
            <Modal title="Mượn sách"
                open={isModalOpen}
                // onOk={handleOkModal}
                onCancel={handleCancel}
                width={1100}
                footer={[
                    <Button key="huy" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="them" type="primary" >
                        {/* onClick={handleOkModal}> */}
                        Thêm
                    </Button>,


                ]}
            >
                <Form
                    form={form}
                    // onFinish={onFinish} 
                    layout="vertical"
                    style={{ margin: 33, }}

                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="userType" label="User Type" rules={[{ required: true, message: 'Please select user type!' }]}>
                                <Select placeholder='User Type' fluid selection
                                // onChange={(value) => setUserType(value)}
                                >
                                    {/* Render options */}
                                </Select>
                            </Form.Item>

                            <Form.Item name="userFullName" label="Họ và tên" rules={[{ required: true, message: 'Please enter full name!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email!', type: 'email' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Please enter password!' }]}>
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Please enter address!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="mobileNumber" label="Số điện thoại" rules={[{ required: true, message: 'Please enter mobile number!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Please select gender!' }]}>
                                <Select placeholder='User Type' fluid selection
                                // value={gender} onChange={(value) => setGender(value)}
                                >
                                    {/* Render options */}
                                </Select>
                            </Form.Item>

                            <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Please select date of birth!' }]}>
                                <DatePicker placeholderText="dd/MM/YYYY" format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>



                            <Form.Item
                                label="Ảnh đại diện"
                                name="photo"
                            >
                                <input type="file" onChange={handleChange} />
                                {imageURL && (
                                    <img
                                        style={{
                                            width: '200px',
                                            height: '200px'
                                        }}
                                        src={imageURL}
                                        alt="Ảnh bìa"
                                    />
                                )}
                            </Form.Item>
                        </Col>

                    </Row>

                    <Form.Item
                        style={{
                            paddingTop: 24,
                        }}
                    >
                        {/* <Button type="primary" htmlType="submit" loading={isLoading}>
                            XÁC NHẬN
                        </Button> */}
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="Mượn sách"
                open={isModalEditOpen}
                // onOk={handleOkModal}
                onCancel={handleCancel}
                width={1100}
                footer={[
                    <Button key="huy" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="them" type="primary"
                        onClick={handleOkModal}>
                        Sửa
                    </Button>,


                ]}
            >
                <Form
                    form={form}
                    // onFinish={onFinish} 
                    layout="vertical"
                    style={{ margin: 33, }}

                >
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="id"
                                name="_id"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item name="userType" label="User Type" rules={[{ required: true, message: 'Please select user type!' }]}>
                                <Select placeholder='User Type' fluid selection
                                // onChange={(value) => setUserType(value)}
                                >
                                    {/* Render options */}
                                </Select>
                            </Form.Item>
                            <Form.Item name="userFullName" label="Họ và tên" rules={[{ required: true, message: 'Please enter full name!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email!', type: 'email' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Please enter password!' }]}>
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col span={8}>

                            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Please enter address!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="mobileNumber" label="Số điện thoại" rules={[{ required: true, message: 'Please enter mobile number!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Please select gender!' }]}>
                                <Select placeholder='User Type' fluid selection
                                // value={gender} onChange={(value) => setGender(value)}
                                >
                                    {/* Render options */}
                                </Select>
                            </Form.Item>

                            <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Please select date of birth!' }]}>
                                <DatePicker placeholderText="dd/MM/YYYY" format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>



                            <Form.Item
                                label="Ảnh đại diện"
                                name="photo"
                            >
                                <input type="file" onChange={handleChange} />
                                {imageURL && (
                                    <img
                                        style={{
                                            width: '200px',
                                            height: '200px'
                                        }}
                                        src={imageURL}
                                        alt="Ảnh bìa"
                                    />
                                )}
                            </Form.Item>
                        </Col>

                    </Row>

                    <Form.Item
                        style={{
                            paddingTop: 24,
                        }}
                    >
                        {/* <Button type="primary" htmlType="submit" loading={isLoading}>
                            XÁC NHẬN
                        </Button> */}
                    </Form.Item>
                </Form>
            </Modal>
        </div>

    )
}

export default GetMember
