import React, { useState } from 'react';
import { Menu, Layout, theme } from 'antd';
import { UserOutlined, BookOutlined, ReadOutlined, TeamOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';
import Transaction from './transactions';
import Profile from './info';
import { Link } from 'react-router-dom'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


function MemberDashboard() {
  const [active, setActive] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (e) => {
    setActive(e.key);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
          <Menu.Item key="transaction" icon={<ReadOutlined />} style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {/* <Link to="/borrow-return">Mượn trả sách</Link> */}
            Mượn trả sách
          </Menu.Item>
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
          <div className="dashboard-addbooks-content" style={active !== "transaction" ? { display: 'none' } : {}}>
            <Transaction />
          </div>
          <div className="dashboard-transactions-content" style={active !== "addtransaction" ? { display: 'none' } : {}}>
            <Transaction />
          </div>
          {/* <div className="dashboard-profile-content" style={active !== "profile" ? { display: 'none' } : {}}>
            < Profile />
          </div> */}

          {/*  <div className="dashboard-addmember-content" style={active !== "addmember" ? { display: 'none' } : {}}>
            <AddMember />
          </div>
          <div className="dashboard-addmember-content" style={active !== "getmember" ? { display: 'none' } : {}}>
            <GetMember />
          </div> */}

        </div>
      </Content>

    </Layout>
  );
}

export default MemberDashboard;
