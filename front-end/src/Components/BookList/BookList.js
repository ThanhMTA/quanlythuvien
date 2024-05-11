import React, { useContext, useEffect, useState } from 'react'
import './BookList.css'
import axios from 'axios'
import Loading from "../Loader/Loader";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useHistory } from "react-router-dom"
import Footer from '../Footer/Footer'

import {
    Button, Modal,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Select,
    TreeSelect,
    Breadcrumb,
    Layout,
    Card,
    theme,
    Image,
    Row,
    Col,
    Typography,
    Switch


} from 'antd';
import getUrlImage from "../../Pages/getURLimage"
import TransController from '../../Controller/TransactionController';
import { AuthContext } from '../../Context/AuthContext.js';
import io from 'socket.io-client';
const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;
const { Meta } = Card;
function BookList() {
    const socket = io('http://localhost:8888');
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null);
    const [book, setBook] = useState(null);
    const { category } = useParams();
    const [listBook, setListbook] = useState([])
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [ellipsis, setEllipsis] = useState(true);
    const { user } = useContext(AuthContext)

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleBookOk = () => {
        setIsBookOpen(false);
    };
    const handleBookCancel = () => {
        setIsBookOpen(false);
    };
    const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        setLoading(true)
        const getListBook = async () => {
            try {
                if (category !== "") {
                    const response = await axios.get(API_URL + 'api/books/getbycate/' + category)
                    setListbook(response.data);

                } else {
                    const response = await axios.get(API_URL + 'api/books/allbooks')
                    setListbook(response.data);
                }

                setLoading(false);

            } catch (err) {
                setLoading(false);
                console.log('Error when get list book =>', err)
            }
        }
        getListBook()
    }, [API_URL])
    const handleBorrowClick = (book) => {
        setBook(book);
        setIsModalOpen(true);
    };
    const handleBookOpen = (book) => {
        setBook(book);
        setIsBookOpen(true);
    };


    const addTransaction = async (values) => {
        try {
            setLoading(true);
            // if (user._id == null) {
            //     <Link to="/signin"></Link>
            // }

            const { borrowerId, bookIds, transactionType, fromDate, toDate } = values;
            const transactionData = {
                books: bookIds,
                borrowerId: borrowerId,
                transactionType: transactionType,
                fromDate: fromDate,
                toDate: toDate,
                returnDate: null
            };

            await TransController.addTransaction(transactionData);

            alert('Tạo phiếu mượn thành công 🎉');
            socket.emit('notifyChange');

        } catch (err) {
            console.log(err);
            alert('Đã xảy ra lỗi khi tạo phiếu mượn');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTransaction = async (transactionId) => {
        try {
            const data = {
                transactionStatus: "True"
            };

            const updatedTransaction = await TransController.updateTransaction(transactionId, data);
            const Transactions = await TransController.getAllTrans();

            console.log('Transaction updated:', updatedTransaction);
            alert('cập nhật thành công 🎉');
            const activeTransactions = Transactions.filter(transaction => transaction && transaction.transactionStatus && transaction.transactionStatus === "Active");
            console.log("thanh", Transactions)

        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleOkModal = () => {
        const formData = {
            borrowerId: user._id,
            bookIds: book._id,
            transactionType: 'Muon',
            fromDate: fromDate,
            toDate: toDate
        };

        addTransaction(formData);
        setIsModalOpen(false);
    };
    if (loading) return <Loading />;

    return (
        <>

            <Content
                style={{
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <div style={{
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    <Breadcrumb
                        style={{ borderWidth: '10px' }}
                        items={[
                            {
                                title: 'Home',
                            },
                            {
                                title: <a href="">Application Center</a>,
                            },
                            {
                                title: <a href="">Application List</a>,
                            },
                            {
                                title: 'An Application',
                            },
                        ]}
                    />
                </div>
                <div className="block-page">

                    <div className="books-page">
                        <div className="title">
                            <label htmlFor="language">Sách theo thể loại "{category}"</label><br />
                        </div>
                        <div className="books">
                            {listBook.map((item, index) => (
                                <>
                                    {/* <div key={index} className="book-card"> */}

                                    <Card
                                        hoverable
                                        style={{
                                            width: 300,
                                            height: 320
                                            //  margin: '10px'
                                        }}
                                    // cover={<img alt="example"
                                    //     src={item.image_url}
                                    //     style={{
                                    //         Height: '200px',
                                    //         width: 240,
                                    //         objectFit: 'cover'
                                    //     }} />}
                                    >
                                        <Image
                                            width={250}
                                            height={180}
                                            src={item.image_url}
                                        />
                                        <Meta
                                            title={item.bookName}
                                            onClick={() => handleBookOpen(item)}
                                            description={item.author}
                                        />


                                        <Button onClick={() => handleBorrowClick(item)}>Mượn</Button>
                                    </Card>



                                    {/* </div> */}

                                </>


                            ))}
                        </div>
                    </div>
                    <Modal title="Mượn sách" open={isModalOpen} onOk={handleOkModal} onCancel={handleCancel}>
                        <Form layout="vertical" style={{ margin: 33 }}>
                            <Form.Item label="Mượn sách" name="book" rules={[{ required: true, message: 'Vui lòng chọn từ ngày' }]}>
                                <Input style={{ width: 400 }} placeholder={book ? book.bookName : ''} value={book ? book._id : ''} readOnly />
                            </Form.Item>
                            <Form.Item label="Từ ngày" name="fromDate" rules={[{ required: true, message: 'Vui lòng chọn từ ngày' }]}>
                                <DatePicker style={{ width: 400 }} placeholder="Chọn từ ngày" onChange={date => setFromDate(date)} />
                            </Form.Item>
                            <Form.Item label="Đến ngày" name="toDate" rules={[{ required: true, message: 'Vui lòng chọn đến ngày' }]}>
                                <DatePicker style={{ width: 400 }} placeholder="Chọn đến ngày" onChange={date => setToDate(date)} />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title="Mượn sách"
                        open={isBookOpen}
                        onOk={handleBookOk}
                        onCancel={handleBookCancel}
                        width={800}
                    >
                        {book && (
                            <>
                                <Row gutter={16}
                                    style={{ padding: 10 }}
                                >
                                    <Col span={12}

                                    >
                                        <Image
                                            width={330}
                                            height={240}
                                            src={book.image_url}
                                        />
                                        <Title level={4}>{book.bookName} </Title>
                                        <Title level={5} type="secondary">{book.author}</Title>
                                        <Title level={5} italic>{book.publisher}</Title>
                                        <Title level={5} strong>Số lượng sách còn:{book.bookCountAvailable}</Title>

                                    </Col>
                                    <Col span={12} style={{
                                        paddingTop: 24,
                                    }}>
                                        <Title level={4}>Mô tả </Title>
                                        <Paragraph
                                            ellipsis={
                                                ellipsis
                                                    ? {
                                                        rows: 5,
                                                        expandable: true,
                                                        symbol: 'more',
                                                    }
                                                    : false
                                            }
                                        >
                                            {book.description}
                                        </Paragraph>
                                    </Col>
                                </Row>


                            </>




                        )}
                    </Modal>
                    <Footer />
                </div>
            </Content>
        </>
    )
}

export default BookList
