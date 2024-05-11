import React, { useEffect, useContext, useState } from 'react';

// import "../AdminDashboard.css";
import axios from 'axios';
// import { AuthContext } from '../../../Context/AuthContext';

import { Dropdown } from 'semantic-ui-react';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { AuthContext } from '../../../Context/AuthContext.js'
import UserController from '../../../Controller/UserController.js';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll
} from "firebase/storage";
// import { StorageError } from 'firebase/storage
// import { storage } from "../../../firebase";
import { Select, Modal, DatePicker, Table, Typography, Button, Form, Row, Col, message, Upload, Input } from 'antd';
const { Option } = Select;
const { Title } = Typography;
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
function Profile() {
    const API_URL = process.env.REACT_APP_API_URL;
    const { user } = useContext(AuthContext)

    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [recentAddedMembers, setRecentAddedMembers] = useState([]);
    const [userType, setUserType] = useState(null);
    const [gender, setGender] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [users, setUsers] = useState([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-xxx',
            percent: 50,
            name: 'image.png',
            status: 'uploading',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-5',
            name: 'image.png',
            status: 'error',
        },
    ]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    const onFinish = async (values) => {
        setIsLoading(true);
        const userData = { ...values, dob: moment(values.dob).format("MM/DD/YYYY") };

        try {
            const response = await axios.post(API_URL + "api/auth/register", userData);
            if (recentAddedMembers.length >= 5) {
                recentAddedMembers.splice(-1);
            }
            setRecentAddedMembers([response.data, ...recentAddedMembers]);
            form.resetFields();
            message.success("Thêm thành viên thành công!");
        } catch (error) {
            console.log(error);
            message.error("Thêm thành viên thất bại!");
        }

        setIsLoading(false);
    };

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/users/allmembers");
                const recentMembers = response.data.slice(0, 5);
                setRecentAddedMembers(recentMembers);
            } catch (err) {
                console.log(err);
            }
        };

        getMembers();
    }, [API_URL]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactions = await UserController.getUser(user._id);
                console.log("user", transactions)
                setUsers(transactions);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchData(); // Gọi fetchData để lấy dữ liệu

    }, [user._id]); // Thêm user._id vào mảng dependencies

    useEffect(() => {
        console.log("userlalala", users.userType);
    }, [users]); // Log giá trị của users khi nó được cập nhật


    return (
        <div>
            <p className="dashboard-option-title">Thông tin cá nhân</p>
            <div className="dashboard-title-line"></div>

            <Form form={form} onFinish={onFinish} layout="vertical"
                style={{ margin: 33, }}

            >

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="userType" label="User Type" rules={[{ required: true, message: 'Please select user type!' }]}>
                            <Select placeholder={users ? users.userType : ''} onChange={(value) => setUserType(value)}>
                                <Select.Option value="Student">Student</Select.Option>
                                <Select.Option value="Teacher">Teacher</Select.Option>
                                <Select.Option value="Saft">Saft</Select.Option>

                            </Select>
                        </Form.Item>
                        <Form.Item name="userFullName" label="Họ và tên" rules={[{ required: true, message: 'Please enter full name!' }]}>
                            <Input placeholder={users ? users.userFullName : ''} />
                        </Form.Item>

                        {/* <Form.Item name={userType === "Student" ? "admissionId" : "employeeId"} label="Mã thẻ" rules={[{ required: true, message: 'Please enter ID!' }]}>
                            <Input placeholder={users ? users.gender : ''} />
                        </Form.Item> */}
                        <Form.Item name="mobileNumber" label="Số điện thoại" rules={[{ required: true, message: 'Please enter mobile number!' }]}>
                            <Input placeholder={users ? users.mobileNumber : '08594620468 '} />
                        </Form.Item>

                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Please select gender!' }]}>
                            <Select placeholder={users ? users.gender : '08594620468 '} fluid selection value={gender} onChange={(value) => setGender(value)}>
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Please enter address!' }]}>
                            <Input placeholder={users ? users.address : ''} />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email!', type: 'email' }]}>
                            <Input placeholder={users ? users.email : '457683'} />
                            {/* <Input value={users ? users.email : '457683'} /> */}

                        </Form.Item>
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Please enter password!' }]}>
                            <Input.Password value={users ? users.password : ''} />

                        </Form.Item>



                        <Form.Item name="password" label="Nhập lại mật khẩu" rules={[{ required: true, message: 'Please enter password!' }]}>
                            <Input.Password value={users ? users.password : ''} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>

                        <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Please select date of birth!' }]}>
                            <DatePicker placeholder={users ? users.dob : '457683'} format="DD/MM/YYYY" />
                        </Form.Item>
                        {/* <DatePicker value={users ? users.dob : '457683'} format="DD/MM/YYYY" /> */}

                        <Form.Item
                            label="Ảnh bìa"
                            name="coverImage"
                            rules={[{ required: true, message: 'Vui lòng tải lên ảnh bìa sách!' }]}
                        >
                            <Upload
                                // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-circle"
                                // fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                <img
                                    alt="example"
                                    style={{
                                        width: '100%',
                                    }}
                                    src={previewImage}
                                />
                            </Modal>
                        </Form.Item>
                    </Col>


                </Row>

                <Form.Item
                    style={{
                        paddingTop: 24,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Lưu thông tin
                    </Button>

                </Form.Item>
            </Form>


        </div>
    )
}

export default Profile;