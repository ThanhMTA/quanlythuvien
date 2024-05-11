import React, { useEffect, useState } from 'react';
import {
    Form, Input, Button, DatePicker, Select, message, Row, Col,
    Modal,
    TreeSelect,
    Popconfirm,
    Image
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

import axios from "axios";
import moment from 'moment';
import io from 'socket.io-client';
import "react-datepicker/dist/react-datepicker.css";

const { Option } = Select;

function AddMember() {
    const API_URL = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [recentAddedMembers, setRecentAddedMembers] = useState([]);
    const [userType, setUserType] = useState(null);
    const [gender, setGender] = useState(null);
    const [openModal, setOpenModal] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const socket = io('http://localhost:8888');
    const handleOkModal = () => {
        const formData = form.getFieldsValue();
        console.log("book update", formData)
        // updateBook(formData)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        // setIsModalOpenDelete(false)

    };
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

    return (
        <div>
            <p className="dashboard-option-title">Thêm người dùng</p>
            <div className="dashboard-title-line"></div>
            <Form form={form} onFinish={onFinish} layout="vertical"
                style={{ margin: 33, }}

            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="userType" label="User Type" rules={[{ required: true, message: 'Please select user type!' }]}>
                            <Select placeholder='User Type' fluid selection onChange={(value) => setUserType(value)}>
                                {/* Render options */}
                            </Select>
                        </Form.Item>

                        <Form.Item name="userFullName" label="Họ và tên" rules={[{ required: true, message: 'Please enter full name!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name={userType === "Student" ? "admissionId" : "employeeId"} label="Mã thẻ" rules={[{ required: true, message: 'Please enter ID!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="mobileNumber" label="Số điện thoại" rules={[{ required: true, message: 'Please enter mobile number!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Please select gender!' }]}>
                            <Select placeholder='User Type' fluid selection value={gender} onChange={(value) => setGender(value)}>
                                {/* Render options */}
                            </Select>
                        </Form.Item>

                        <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Please select date of birth!' }]}>
                            <DatePicker placeholderText="dd/MM/YYYY" format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Please enter address!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email!', type: 'email' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Please enter password!' }]}>
                            <Input.Password />
                        </Form.Item>
                    </Col>

                </Row>

                <Form.Item
                    style={{
                        paddingTop: 24,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        XÁC NHẬN
                    </Button>
                </Form.Item>
            </Form>

            <p className="dashboard-option-title">Mới thêm gần đây</p>
            <div className="dashboard-title-line"></div>
            <table className='admindashboard-table'>
                <tr>
                    <th>STT</th>
                    <th>Loại tài khoản</th>
                    <th>Mã tài khoản</th>
                    <th>Họ và tên</th>
                </tr>
                {
                    recentAddedMembers.map((member, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{member.userType}</td>
                                <td>{member.userType === "Student" ? member.admissionId : member.employeeId}</td>
                                <td>{member.userFullName}</td>
                            </tr>
                        )
                    })
                }
            </table>
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
                                <Input  readOnly />
                            </Form.Item>
                            <Form.Item
                                label="Tên sách"
                                name="bookName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            >
                                <Input.TextArea rows={2} />
                            </Form.Item>

                            <Form.Item
                                label="Tên tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}

                            >
                                <Input value onChange />
                            </Form.Item>
                            <Form.Item label="Ngôn ngữ" name="language"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}>

                                <Select
                                    placeholder="Chọn ngôn ngữ"
                                    onChange
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
                                <Input value onChange />
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
                                    onChange
                                    style={{ fontSize: '16px' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {/* {allCategories.map(category => (
                                        <Select.Option key={category.categoryName} value={category.categoryName}>
                                            {category.categoryName}
                                        </Select.Option>
                                    ))} */}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Tổng sách sẵn có"
                                name="bookCount"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng sách sẵn có!' }]}
                            >
                                <Input value onChange type="number" />
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

                                <Input.TextArea value onChange rows={5} />
                            </Form.Item>



                        </Col>
                        <Col span={8}>


                            <Form.Item
                                label="Ảnh bìa"
                                name="image"
                            >
                                <input type="file" onChange />
                                {/* {imageURL && (
                                    // setImageURL=image_url
                                    <img
                                        style={{
                                            width: '200px',
                                            height: '200px'
                                        }}
                                        src={imageURL}
                                        alt="Ảnh bìa"
                                    />
                                )} */}
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
        </div>
    );
}

export default AddMember;
