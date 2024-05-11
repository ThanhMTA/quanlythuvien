import React, { useEffect, useContext, useState } from 'react';

// import "../AdminDashboard.css";
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../../../../Context/AuthContext';
import { Dropdown } from 'semantic-ui-react';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import CateController from '../../../../Controller/CateController';
import bookController from '../../../../Controller/bookController';

import Loading from '../../../../Components/Loader/Loader';

import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll
} from "firebase/storage";
import { storage } from "../../../../firebase";
import { Select, Typography, Button, Form, Row, Col, Modal, Upload, Input } from 'antd';
const { Option } = Select;
const { Title } = Typography;
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
function AddBook() {
    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext);

    const [recentAddedBooks, setRecentAddedBooks] = useState([]);
    const [bookName, setBookName] = useState("");
    const [author, setAuthor] = useState("");
    const [bookCount, setBookCount] = useState(null);
    const [language, setLanguage] = useState("vi");
    const [publisher, setPublisher] = useState("");
    const [allCategories, setAllCatagories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alternateTitle, setAlternateTitle] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [description, setDescription] = useState("");
    const socket = io('http://localhost:8888');
    // Khởi tạo state cho biến publisher và hàm setPublisher để cập nhật giá trị
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




    const [openModal, setOpenModal] = useState(false);

    const [categoryName, setCategoryName] = useState('');

    const [selectedImage, setSelectedImage] = useState(null);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        setIsLoading(true);
        // Gửi dữ liệu đi
        console.log('Received values:', values);
        setIsLoading(false);
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

    useEffect(() => {
        console.log(imageUpload);

    }, [imageUpload])

    const handleImageUpload = (info) => {
        const { file } = info;

        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    // useEffect(() => {
    //     const getAllBookks = async () => {
    //         const response = await axios.get(API_URL + "api/books/allbooks");
    //         setRecentAddedBooks(response.data.slice(0, 5));
    //     }

    //     getAllBookks();
    // }, [API_URL]);
    useEffect(() => {
        const getAllBooks = async () => {
            try {
                const response = await axios.get(API_URL + "api/books/allbooks");
                if (Array.isArray(response.data)) {
                    setRecentAddedBooks(response.data.slice(0, 5));
                } else {
                    console.error("Data returned from the API is not an array:", response.data);
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        getAllBooks();
    }, [API_URL]);

    // const handleSelectCate = () => {
    //     setCategoryName(userId)
    //     // fetchUserTransactions(userId);
    // };
    console.log("id", user._id)
    const addBook = async (values) => {
        try {
            setIsLoading(true);


            // Extracting form values
            const {
                language,
                publisher,
                description,
                categoryName,
                bookName,
                author,
                bookCount
            } = values;
            const formData = new FormData();
            console.log("anh", formData)
            formData.append('image', file);
            formData.append('language', language);
            formData.append('publisher', publisher);
            formData.append('description', description);
            formData.append('categories', categoryName);
            formData.append('bookName', bookName);
            formData.append('author', author);
            formData.append('bookCountAvailable', bookCount);
            formData.append('bookCount', bookCount);
            formData.append('staff_creat', user._id);




            // Create a book object
            console.log('add book', formData)
            // Adding transaction
            // await bookController.addBook(book); // Sử dụng await để đợi hàm hoàn thành
            const response = await fetch('http://localhost:5000/api/books/addbook', {
                method: 'POST',
                body: formData
            });
            console.log('add book', response)

            const data = await response.json();
            console.log('add book', data)
            // const imagePath = data.imagePath;
            // Alerting success message
            alert('Thêm sách thành công 🎉');
            socket.emit('notifyChange');

        } catch (err) {
            console.log("loi j", err);
            alert('Đã xảy ra lỗi khi tạo book');
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoading) return <Loading />;

    return (
        <div>
            <p className="dashboard-option-title">Thêm một đầu sách mới</p>
            <div className="dashboard-title-line"></div>

            <Form
                form={form}
                name="addbook-form"
                onFinish={addBook}
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                // onFinish={addTransaction}
                layout="vertical"
                style={{ margin: 33, }}
            >
                <Row gutter={16}>
                    <Col span={9}>
                        <Form.Item
                            label="Tên sách"
                            name="bookName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                        >
                            <Input value={bookName} onChange={handlebookNameChange} />
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
                    <Col span={9}>

                        <Form.Item
                            label="Số lượng sách sẵn có"
                            name="bookCount"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng sách sẵn có!' }]}
                        >
                            <Input value={bookCount} onChange={handleBookCountChange} type="number" />
                        </Form.Item>

                        <Form.Item
                            name="categoryName"
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




                        <Form.Item label="Mô tả" name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}>
                            <Input.TextArea value={description} onChange={handledescriptionChange} rows={4} />
                        </Form.Item>



                    </Col>
                    <Col span={6}>


                        <Form.Item
                            label="Ảnh bìa"
                            name="image"
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
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Thêm mới
                    </Button>
                </Form.Item>



            </Form>

            <div>
                {/* <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
                    <Card className="conf_modal">
                        <CardContent>
                            <h2>Thêm thể loại</h2>
                        </CardContent>
                        <CardActions className="conf_modal_actions">

                            <TextField
                                label="Tên thể loại"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                fullWidth
                            />

                        </CardActions>
                        <div className="button-modal">
                            <Button className="button-modal" variant="contained" color="error" onClick={() => setOpenModal(false)}>
                                Hủy bỏ
                            </Button>
                            <Button className="button-modal" variant="contained" color="success" onClick={addCate}>
                                Lưu
                            </Button>
                        </div>
                    </Card>
                </Modal> */}
            </div>

            {/* <div>
                <p className="dashboard-option-title">Sách mới thêm gần đây</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tr>
                        <th>STT</th>
                        <th>Tên sách</th>
                        <th>Ngày thêm</th>
                    </tr>
                    {
                        recentAddedBooks.map((book, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.createdAt}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div> */}
        </div>
    )
}

export default AddBook;