import { React, useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import './Header.css';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext.js"
import { useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import io from 'socket.io-client';
import moment from 'moment';
// import {userService} from "../services/authentication.service";
import { userService } from '../../services/authentication.service.js';

import {
    Avatar,
    Badge,
    Drawer,
    Button,
    List,
    Skeleton,
    Collapse,
    Typography,
    Form,
    Modal,
    Row,
    Col,
} from 'antd';
import { BellOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const { Text } = Typography;

const count = 10;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
function Header() {
    const [menutoggle, setMenutoggle] = useState(false)
    const [form] = Form.useForm();
    const history = useHistory();
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [countNotify, setCountNotify] = useState(0);
    const [notifyStaff, setNotifyStaff] = useState(false);
    const [notifyUser, setNotifyUser] = useState(false);
    const [selectedNotify, setSelectedNotify] = useState(false);

    const [socket, setSocket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);
    console.log("user=> login", user)
    // lay count  Notify
    const handleOk = () => {
        setIsModalOpen(false);

    };
    const handleCancel = () => {
        setIsModalOpen(false);

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
        setSelectedNotify(record);
        handleNotifyClick(record)
        setIsModalOpen(true); // Hiển thị Modal


    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             console.log("user._id", user._id)
    //             if (user.isAdmin) {
    //                 const response = await fetch(`http://localhost:5000/api/notify/countSaft/${user._id}`); // Thay đổi URL tùy thuộc vào đường dẫn của API
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch books');
    //                 }
    //                 const data = await response.json();
    //                 setCountNotify(data); // Cập nhật state allBooks với dữ liệu từ API
    //             }
    //             else {
    //                 const response = await fetch(`http://localhost:5000/api/notify/countUesr/${user._id}`); // Thay đổi URL tùy thuộc vào đường dẫn của API
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch books');
    //                 }
    //                 const data = await response.json();
    //                 setCountNotify(data); // Cập nhật state allBooks với dữ liệu từ API
    //             } // Cập nhật state allBooks với dữ liệu từ API
    //         } catch (error) {
    //             console.error('Error fetching books:', error);
    //         }
    //     };

    //     fetchData(); // Gọi fetchData để lấy dữ liệu
    //     const newSocket = io('http://localhost:8888'); // Thay đổi URL phù hợp với máy chủ của bạn
    //     setSocket(newSocket);

    //     // Lắng nghe sự kiện từ máy chủ
    //     newSocket.on('dataChanged', () => {
    //         // Khi có sự thay đổi, gọi lại fetchData để cập nhật số lượng thông báo
    //         fetchData();
    //     });

    //     // Cleanup function để đóng kết nối khi component unmount
    //     return () => {
    //         newSocket.disconnect();
    //     };
    // }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.isAdmin) {
                    const response = await fetch(`http://localhost:5000/api/notify/countSaft/${user._id}`,
                        {
                            headers: {
                                'Authorization': userService.getToken()
                            }
                        }
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch books');
                    }
                    const data = await response.json();
                    setCountNotify(data);
                } else {
                    const response = await fetch(`http://localhost:5000/api/notify/countUesr/${user._id}`,
                        {
                            headers: {
                                'Authorization': userService.getToken()
                            }
                        });
                    if (!response.ok) {
                        throw new Error('Failed to fetch books');
                    }
                    const data = await response.json();
                    setCountNotify(data);
                    console.log("test", countNotify)
                    console.log("user._id", user._id)

                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchData();
        const newSocket = io('http://localhost:8888');
        setSocket(newSocket);

        newSocket.on('dataChanged', () => {
            fetchData();
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    //  lấy thông tin Notify

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.isAdmin) {
                    const response = await fetch(`http://localhost:5000/api/notify/staff-notify/${user._id}`,
                        {
                            headers: {
                                'Authorization': userService.getToken()
                            }
                        }); // Thay đổi URL tùy thuộc vào đường dẫn của API
                    if (!response.ok) {
                        throw new Error('Failed to fetch books');
                    }
                    const data = await response.json();
                    setNotifyStaff(data); // Cập nhật state allBooks với dữ liệu từ API
                }
                else {
                    const response = await fetch(`http://localhost:5000/api/notify/user-notify/${user._id}`,
                        {
                            headers: {
                                'Authorization': userService.getToken()
                            }
                        }); // Thay đổi URL tùy thuộc vào đường dẫn của API
                    if (!response.ok) {
                        throw new Error('Failed to fetch books');
                    }
                    const data = await response.json();
                    setNotifyUser(data); // Cập nhật state allBooks với dữ liệu từ API
                }


            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchData(); // Gọi fetchData để lấy dữ liệu
        const newSocket = io('http://localhost:8888'); // Thay đổi URL phù hợp với máy chủ của bạn
        setSocket(newSocket);

        // Lắng nghe sự kiện từ máy chủ
        newSocket.on('dataChanged', () => {
            // Khi có sự thay đổi, gọi lại fetchData để cập nhật số lượng thông báo
            fetchData();
        });

        // Cleanup function để đóng kết nối khi component unmount
        return () => {
            newSocket.disconnect();
        };

    }, []);
    const handleNotifyClick = async (notify) => {
        try {
            // Gọi API để cập nhật NotifyStatus của thông báo
            await fetch(`http://localhost:5000/api/notify/update/${notify._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userService.getToken()
                },
                body: JSON.stringify({ NotifyStatus: 0 }),
            });
            socket.emit('notifyChange');
            // Cập nhật lại danh sách thông báo trên giao diện
            if (user.isAdmin) {
                const response = await fetch(`http://localhost:5000/api/notify/countSaft/${user._id}`,
                    {
                        headers: {
                            'Authorization': userService.getToken()
                        }
                    }); // Thay đổi URL tùy thuộc vào đường dẫn của API
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await response.json();
                setCountNotify(data); // Cập nhật state allBooks với dữ liệu từ API
            }
            else {
                const response = await fetch(`http://localhost:5000/api/notify/countUesr/${user._id},
                {
                    headers: {
                      'Authorization': userService.getToken()
                    }
                  }`); // Thay đổi URL tùy thuộc vào đường dẫn của API
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await response.json();
                setCountNotify(data); // Cập nhật state allBooks với dữ liệu từ API
            } // Cập nhật state allBooks với dữ liệu từ API
        } catch (error) {
            console.error('Error updating notify:', error);
        }
    };

    console.log("dem", countNotify)
    // console.log("dem", notifyUser)

    const onChange = (key) => {
        console.log(key);
    };
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const Toggle = () => {
        setMenutoggle(!menutoggle)
    }

    const closeMenu = () => {
        setMenutoggle(false)
    }



    const [searchTerm, setSearchTerm] = useState("");


    const handleSearch = (event) => {
        event.preventDefault();
        // Gửi yêu cầu tìm kiếm
        console.log("Từ khóa tìm kiếm:", searchTerm);

        history.push(`/search/${searchTerm}`);

    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch(event);
        }
    };
    // thong bao 
    useEffect(() => {
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                setInitLoading(false);
                setData(res.results);
                setList(res.results);
            });
    }, []);
    const onLoadMore = () => {
        setLoading(true);
        setList(
            data.concat(
                [...new Array(count)].map(() => ({
                    loading: true,
                    name: {},
                    picture: {},
                })),
            ),
        );
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                const newData = data.concat(res.results);
                setData(newData);
                setList(newData);
                setLoading(false);
                // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                // In real scene, you can using public method of react-virtualized:
                // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                window.dispatchEvent(new Event('resize'));
            });
    };
    const loadMore =
        !initLoading && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;

    return (
        <div className="header">
            <div className="logo-nav">
                <Link to="/">
                    <a href="#home">THƯ VIỆN MTA </a>
                </Link>
            </div>
            <div className="nav-right">

                <div className="search-container">
                    <input className="search-input" type="text" placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        onKeyUp={handleKeyPress}

                    />

                </div>


                <ul className={menutoggle ? "nav-options active" : "nav-options"}>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to="/">
                            <a href="#home">Trang chủ</a>
                        </Link>
                    </li>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to="/books">
                            <a href="#books">Kho sách</a>
                        </Link>
                    </li>

                    {!user ? (
                        <>
                            <li className="option" onClick={() => { closeMenu() }}>
                                <Link to="/signin">
                                    <a href="signin">Đăng nhập</a>
                                </Link>
                            </li>

                            <li className="option" onClick={() => { closeMenu() }}>
                                <Link to="/signup">
                                    <a href="signup">Đăng ký</a>
                                </Link>
                            </li>


                        </>
                    ) : (
                        <>
                            <li className="option" onClick={() => { closeMenu() }}>
                                <Link to="/signin">
                                    <a href="signin">Admin</a>
                                </Link>
                            </li>
                            <li className="option" onClick={() => { closeMenu() }}>
                                <a href="#">
                                    <Badge count={countNotify}>
                                        {/* <Avatar shape="square" size="large" /> */}
                                        <div className="bell-icon">
                                            <BellOutlined
                                                style={{
                                                    fontSize: '25px',
                                                    color: '#fff',
                                                    padding: '4px'
                                                }}
                                                onClick={showDrawer}
                                            />
                                        </div>
                                    </Badge>
                                </a>
                            </li>
                        </>
                    )}

                </ul>
            </div>
            <div className="mobile-menu" onClick={() => { Toggle() }}>
                {menutoggle ? (
                    <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                ) : (
                    <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                )}
            </div>

            {/* <Drawer title="Thông báo" onClose={onClose} open={open}>
                <List
                    className="demo-loadmore-list"
                    loading={initLoading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    // dataSource={notifyStaff} // Sử dụng user.isAdmin để xác định người dùng có phải là admin không

                    dataSource={user && user.isAdmin ? notifyStaff : notifyUser} // Sử dụng user.isAdmin để xác định người dùng có phải là admin không
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a onClick={() => handleNotifyClick(item)}>{item.NotifyName}</a>}
                                description={item.description} // Hiển thị mô tả của thông báo
                            />
                        </List.Item>
                    )}
                />
            </Drawer> */}

            <Drawer title="Thông báo" onClose={onClose} open={open}>
                <List
                    className="demo-loadmore-list"
                    loading={initLoading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={user && user.isAdmin ? notifyStaff : notifyUser}
                    renderItem={(item) => (
                        <List.Item className={item.NotifyStatus === 1 ? 'unread' : 'read'}>
                            <List.Item.Meta
                                title={
                                    <a
                                        onClick={() => {
                                            showModal(item);
                                            // item.NotifyStatus = 0; // Cập nhật trạng thái đã đọc
                                        }}
                                    >
                                        {item.NotifyName}
                                    </a>
                                }
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Drawer>

            <Modal
                title="Thông báo"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="huy" type="primary" onClick={handleCancel}>
                        Cancel
                    </Button>,
                ]}
            >
                {selectedNotify && (
                    <Form style={{ margin: 33 }}>
                        {selectedNotify.NotifyName && (
                            <Form.Item name="NotifyName" label="Tiêu đề">
                                {selectedNotify.NotifyName}
                            </Form.Item>
                        )}
                        {selectedNotify.description && (
                            <Form.Item name="description" label="Mô tả">
                                {selectedNotify.description}
                            </Form.Item>
                        )}
                        {selectedNotify.transactions && (
                            <Form.Item name="transactions" label="Mã giao dịch">
                                {selectedNotify.transactions}
                            </Form.Item>
                        )}
                        {selectedNotify.books && (
                            <Form.Item name="books" label="Mã sách">
                                {selectedNotify.books}
                            </Form.Item>
                        )}
                        {selectedNotify.user && (
                            <Form.Item name="user" label="Mã người dùng">
                                {selectedNotify.user}
                            </Form.Item>
                        )}
                        {selectedNotify.staff_creat && (
                            <Form.Item name="staff_creat" label="Mã nhân viên tạo">
                                {selectedNotify.staff_creat}
                            </Form.Item>
                        )}
                        {selectedNotify.staff_edit && (
                            <Form.Item name="staff_edit" label="Mã nhân viên cập nhật">
                                {selectedNotify.staff_edit}
                            </Form.Item>
                        )}
                        {selectedNotify.createdAt && (
                            <Form.Item name="createdAt" label="Thời gian cập nhật">
                                {moment(selectedNotify.createdAt).format('ss:mm:HH DD/MM/YYYY ')}
                            </Form.Item>
                        )}
                    </Form>
                )}

            </Modal>
        </div >




    )
}

export default Header
