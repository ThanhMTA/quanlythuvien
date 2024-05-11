import React, { useEffect, useContext, useState } from 'react';
import io from 'socket.io-client';
import "../AdminDashboard.css";
import axios from 'axios';
import { AuthContext } from '../../../../Context/AuthContext';
// import { userService } from "../services/authentication.service";
import { userService } from '../../../../services/authentication.service';

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
import { tableCellClasses } from '@mui/material/TableCell';

import getUrlImage from "../../../../Pages/getURLimage"
import Loading from "../../../../Components/Loader/Loader";
import bookController from '../../../../Controller/bookController';
import CateController from '../../../../Controller/CateController';

import { styled } from '@mui/material/styles';
import {
    Modal,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Select,
    TreeSelect,
    Row,
    Col, Button,
    Popconfirm,
    Image
} from 'antd';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 20,

    },
}));


function AddBook() {
    const { user } = useContext(AuthContext);
    const API_URL = process.env.REACT_APP_API_URL
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [openModal, setOpenModal] = useState(false)
    const [activeBookID, setActiveBookID] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [bookName, setBookName] = useState("");
    const [author, setAuthor] = useState("");
    const [bookCount, setBookCount] = useState(null);
    const [language, setLanguage] = useState("vi");
    const [publisher, setPublisher] = useState("");
    const [allCategories, setAllCatagories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState("");
    const [book, setBook] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const [file, setFile] = useState();
    // function handleChange(e) {
    //     console.log(e.target.files);
    //     setFile(URL.createObjectURL(e.target.files[0]));
    // }
    function handleChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
            setImageURL(imageUrl);
        }
    }

    const handlePublisherChange = (e) => {
        setPublisher(e.target.value); // Cập nhật giá trị của biến publisher khi người dùng nhập vào Input
    };
    const handledescriptionChange = (e) => {
        setDescription(e.target.value); // Cập nhật giá trị của biến publisher khi người dùng nhập vào Input
    };
    const handlebookNameChange = (e) => {
        setBookName(e.target.value); // Cập nhật giá trị của biến publisher khi người dùng nhập vào Input
    };
    const handleAuthorChange = (e) => {
        setAuthor(e.target.value); // Cập nhật giá trị của biến publisher khi người dùng nhập vào Input
    };
    const handleBookCountChange = (e) => {
        setBookCount(e.target.value); // Cập nhật giá trị của biến publisher khi người dùng nhập vào Input
    };
    const handleOk = () => {
        setIsModalOpen(false);
        setIsModalOpenDelete(false)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalOpenDelete(false)

    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allCates = await CateController.getAllCates();
                setAllCatagories(allCates);
                console.log("tanh", allCates);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchData(); // Gọi fetchData để lấy dữ liệu

    }, []);
    // const updateBook = async (book) => {
    //     try {
    //         setIsLoading(true);
    //         // Gọi hàm updateTransaction từ TransController để cập nhật giao dịch
    // const updatedTransaction = await bookController.updateBook(book._id, book);
    // const books = await bookController.getAllBooks();

    //         // Lọc danh sách các giao dịch có trạng thái là "Active"
    //         // const activeTransactions = allTransactions.filter(transaction => transaction && transaction.transactionStatus === "Active");
    //         setBooks(books)
    //         console.log('Transaction updated:', updatedTransaction);
    //         alert('cập nhật thành công 🎉');

    //     } catch (error) {
    //         console.error('Error updating transaction:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    // const updateBook = async (book) => {
    //     try {
    //         setIsLoading(true);
    //         console.log("book update 123", book)
    //         console.log("book update 123", file)

    //         const formData = new FormData();
    //         formData.append('image', file);
    //         formData.append('language', book.language);
    //         formData.append('publisher', book.publisher);
    //         formData.append('description', book.description);
    //         formData.append('bookStatus', book.bookStatus);
    //         formData.append('categories', book.categories);
    //         formData.append('bookName', book.bookName);
    //         formData.append('author', book.author);
    //         formData.append('bookCountAvailable', book.bookCountAvailable);
    //         formData.append('bookCount', book.bookCount);
    //         formData.append('staff_edit', user._id);
    //         alert('Cập nhật thành công 🎉');
    //         const updatedTransaction = await bookController.updateBook(book._id,formData);
    //         const updatedBooks = await bookController.getAllBooks();
    //         setBooks(updatedBooks);
    //     } catch (error) {
    //         console.error('Error updating book:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const socket = io('http://localhost:8888');
    const updateBook = async (book) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('image', file);
            formData.append('language', book.language);
            formData.append('publisher', book.publisher);
            formData.append('description', book.description);
            formData.append('bookStatus', book.bookStatus);
            formData.append('categories', book.categories);
            formData.append('bookName', book.bookName);
            formData.append('author', book.author);
            formData.append('bookCountAvailable', book.bookCountAvailable);
            formData.append('bookCount', book.bookCount);
            formData.append('staff_edit', user._id);
            // const response = await bookController.updateBook(book._id,formData);
            // Use fetch to send a PUT request
            const response = await fetch(`http://localhost:5000/api/books/updatebook/${book._id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': userService.getToken()
                }
            });


            // Assuming the update is successful, notify the user
            alert('Cập nhật thành công 🎉');
            socket.emit('notifyChange');
            const books = await bookController.getAllBooks();
            //         const updatedBooks = await bookController.getAllBooks();
            setBooks(books)
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


    const handleOkModal = () => {
        const formData = form.getFieldsValue();
        console.log("book update", formData)
        updateBook(formData)
        setIsModalOpen(false);
    };
    const confirm = async (id) => {
        try {
            const deletebook = await bookController.deleteBook(id);
            const books = await bookController.getAllBooks();
            setBooks(books)
            alert('xóa thành côngcông thành công 🎉');
        }
        catch (error) {
            console.error('Error updating transaction:', error);
        } finally {
            setIsLoading(false);
        }
        // console.log(e);
        // message.success('Click on Yes');
    };
    const cancel = (e) => {
        console.log(e);
        // message.error('Click on No');
    };
    const handledeleteBook = async (id) => {
        try {

            // Gọi hàm updateTransaction từ TransController để cập nhật giao dịch
            alert(' Bạn có thực sự muốn xóa ');
            var xoa = confirm('Bạn có thực sự muốn xóa?');
            const deletebook = await bookController.deleteBook(id);
            const books = await bookController.getAllBooks();

            // Lọc danh sách các giao dịch có trạng thái là "Active"
            // const activeTransactions = allTransactions.filter(transaction => transaction && transaction.transactionStatus === "Active");
            setBooks(books)
            alert('xóa thành côngcông thành công 🎉');
            socket.emit('notifyChange');

        } catch (error) {
            console.error('Error updating transaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBorrowClick = (book) => {
        setBook(book);
        setIsModalOpen(true);
    };

    const showEditModal = (record) => {

        form.setFieldsValue({
            _id: record._id,
            language: record.language,
            image_url: record.image_url,
            publisher: record.publisher,
            description: record.description,
            categories: record.categories, // Kiểm tra xem tên trường có đúng không
            bookName: record.bookName,
            author: record.author,
            bookCountAvailable: record.bookCountAvailable,
            bookCount: record.bookCount
        });
        if (record.image_url) {
            setImageURL(record.image_url);
        }
        setIsModalOpen(true); // Hiển thị Modal
    };
    const fetchBooks = async () => {
        const response = await axios.get(API_URL + "api/books/allbooks",
            {
                headers: {
                    'Authorization': userService.getToken()
                }
            })
        setBooks(response.data);
        setLoading(false);
        console.log("book", response.data)

    }
    useEffect(() => {
        setLoading(true)
        fetchBooks();

    }, [])

    if (loading) return <Loading />;

    return (
        <div>
            <div>
                <p className="dashboard-option-title">Tất cả đầu sách</p>
                <div className="dashboard-title-line"></div>
            </div>
            <>
                {books.length > 0 ? (
                    <>
                        <div className="tableContainer">
                            <TableContainer component={Paper} style={{ maxWidth: '1160px' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>STT</StyledTableCell>
                                            <StyledTableCell>Tên sách</StyledTableCell>
                                            <StyledTableCell>Tác giả</StyledTableCell>
                                            <StyledTableCell>Thể loại</StyledTableCell>
                                            <StyledTableCell>Số lượng</StyledTableCell>
                                            <StyledTableCell>Hành động</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : books
                                        )
                                            .map((book, index) => (
                                                <TableRow key={book.isbn}>
                                                    <TableCell >
                                                        {/* <Image width={50} className="image-table" src={book.image_url} alt="" />?\ */}
                                                        {page * 10 + index + 1}
                                                    </TableCell>
                                                    <TableCell align="left" >{book.bookName}</TableCell>
                                                    <TableCell align="left" >{book.author}</TableCell>
                                                    <TableCell>{book.categories}</TableCell>
                                                    <TableCell align="left">{book.bookCountAvailable}</TableCell>
                                                    <TableCell align="left" >
                                                        <div className="actionsContainer">
                                                            <Button
                                                                variant="contained"
                                                                // component={RouterLink}
                                                                size="small"
                                                                onClick={() => showEditModal(book)}
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
                                                                        to={`/admin/books/${book._id}/edit`}
                                                                        onClick={() => showEditModal(book)}
                                                                    >
                                                                        Sửa
                                                                    </Button>
                                                                    <Popconfirm
                                                                        title="Xóa sách"
                                                                        description="Bạn thực sự muốn xóa!!!"
                                                                        onConfirm={() => confirm(book._id)}
                                                                        onCancel={cancel}
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
                                count={books.length}
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
            <Modal title="Mượn sách"
                open={isModalOpen}
                onOk={handleOkModal}
                onCancel={handleCancel}
                width={1100}
                footer={[
                    <Button key="huy" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="sửa" type="primary" onClick={handleOkModal}>
                        Sửa
                    </Button>,


                ]}
            >
                <Form
                    form={form}
                    name="addbook-form"
                    // onFinish={addBook}
                    // labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    // onFinish={addTransaction}
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
                                <Input onChange={handlebookNameChange} readOnly />
                            </Form.Item>
                            <Form.Item
                                label="Tên sách"
                                name="bookName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            >
                                <Input.TextArea onChange={handlebookNameChange} rows={2} />
                            </Form.Item>

                            <Form.Item
                                label="Tên tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}

                            >
                                <Input value={author} onChange={handleAuthorChange} />
                            </Form.Item>
                            <Form.Item label="Ngôn ngữ" name="language"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}>

                                <Select
                                    placeholder="Chọn ngôn ngữ"
                                    onChange={setLanguage}
                                    style={{ fontSize: '16px' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option value="Vi">Tiếng Việt</Select.Option>
                                    <Select.Option value="En">Tiếng Anh</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Nhà xuất bản" name="publisher"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}>
                                <Input value={publisher} onChange={handlePublisherChange} />
                            </Form.Item>


                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="categories"
                                label="Chọn thể loại"
                                rules={[{ required: true, message: 'Vui lòng chọn độc giả!' }]}
                            >
                                <Select
                                    placeholder="Chọn thể loại"
                                    onChange={setCategoryName}
                                    style={{ fontSize: '16px' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {allCategories.map(category => (
                                        <Select.Option key={category.categoryName} value={category.categoryName}>
                                            {category.categoryName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Tổng sách sẵn có"
                                name="bookCount"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng sách sẵn có!' }]}
                            >
                                <Input value={bookCount} onChange={handleBookCountChange} type="number" />
                            </Form.Item>
                            <Form.Item
                                label="Số lượng sách sẵn có"
                                name="bookCountAvailable"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng sách sẵn có!' }]}
                            >
                                <Input type="number" />
                            </Form.Item>






                            <Form.Item label="Tiêu đề thay thế" name="description"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}>

                                <Input.TextArea value={description} onChange={handledescriptionChange} rows={5} />
                            </Form.Item>



                        </Col>
                        <Col span={8}>


                            <Form.Item
                                label="Ảnh bìa"
                                name="image"
                            >
                                <input type="file" onChange={handleChange} />
                                {imageURL && (
                                    // setImageURL=image_url
                                    <img
                                        style={{
                                            width: '300px',
                                            height: '290px'
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
                            Thêm mới
                        </Button> */}
                    </Form.Item>



                </Form>
            </Modal>
            <Modal title="Xóa sách" open={isModalOpenDelete} onOk={handleOkModal} onCancel={handleCancel}>
                <Form
                    // form={form}

                    layout="vertical"
                    style={{ margin: 33, }}
                >
                    <p>Bạn thực sự muốn xóa !!!!!</p>

                </Form>
            </Modal>

        </div>

    )
}

export default AddBook;