
import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {
    UserOutlined, BookOutlined, ReadOutlined, TeamOutlined, UserAddOutlined, LogoutOutlined,
    NotificationOutlined
} from '@ant-design/icons';
import AddTransaction from './Components/AddTransaction.js'
import AddMember from './Components/AddMember.js'
import AddBook from './Components/AddBook.js';
import ManagerBook from './Components/ManagerBook.js';
import Return from './Components/Return.js';
import GetMember from './Components/GetMember.js';
import Info from './Components/info.js';
const { Header, Content, Sider } = Layout;



const { SubMenu } = Menu;

function AdminDashboard() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [active, setActive] = useState("manabook");
    const [collapsed, setCollapsed] = useState(false);

    const handleClick = (e) => {
        setActive(e.key);
    };

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const logout = () => {
        localStorage.removeItem("user");
        // Redirect to SignIn page
        window.location.href = '/signin';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={handleCollapse}
                width={250} // Adjust sidebar width here
            >
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleClick} selectedKeys={[active]}>

                    <SubMenu key="book" icon={<BookOutlined />} title="Quản lý sách" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        <Menu.Item key="manabook" style={{ fontSize: '16px', fontWeight: 'bold' }}>Quản lý sách</Menu.Item>
                        <Menu.Item key="addbook" style={{ fontSize: '16px', fontWeight: 'bold' }}>Thêm sách</Menu.Item>
                    </SubMenu>
                    <SubMenu key="transaction" icon={<ReadOutlined />} title="Quản lý mượn trả" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        <Menu.Item key="addtransaction" style={{ fontSize: '16px', fontWeight: 'bold' }}>Mượn sách</Menu.Item>
                        <Menu.Item key="returntransaction" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                            Trả sách
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="getmember" icon={< TeamOutlined />} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Quản lý độc giả
                    </Menu.Item>
                    {/* <Menu.Item key="profile" icon={<UserOutlined />} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Thông tin cá nhân
                    </Menu.Item> */}
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Đăng xuất
                    </Menu.Item>
                </Menu>
            </Sider>
            <Content
                style={{
                    padding: 24,
                    margin: 20,
                    minHeight: 280,
                    width: 300,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <div className="dashboard-option-content">
                    <div className="dashboard-addbooks-content" style={active !== "addbook" ? { display: 'none' } : {}}>
                        <AddBook />
                    </div>
                    <div className="dashboard-addbooks-content" style={active !== "manabook" ? { display: 'none' } : {}}>
                        < ManagerBook />
                    </div>
                    <div className="dashboard-transactions-content" style={active !== "addtransaction" ? { display: 'none' } : {}}>
                        <AddTransaction />
                    </div>
                    <div className="dashboard-addmember-content" style={active !== "addmember" ? { display: 'none' } : {}}>
                        <AddMember />
                    </div>
                    <div className="dashboard-addmember-content" style={active !== "getmember" ? { display: 'none' } : {}}>
                        <GetMember />
                    </div>
                    <div className="dashboard-addmember-content" style={active !== "returntransaction" ? { display: 'none' } : {}}>
                        <Return />
                    </div>

                    <div className="dashboard-profile-content" style={active !== "profile" ? { display: 'none' } : {}}>
                        < Info />
                    </div>

                </div>
            </Content>

        </Layout>
    );
}

export default AdminDashboard;
