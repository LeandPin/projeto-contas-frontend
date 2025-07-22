import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { DashboardOutlined, SwapOutlined, AppstoreAddOutlined } from '@ant-design/icons';

const SidebarMenu = () => {
    const items = [
        { key: '1', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
        { key: '2', icon: <SwapOutlined />, label: <Link to="/lancamentos">Lançamentos</Link> },
        { key: '3', icon: <AppstoreAddOutlined />, label: <Link to="/cadastros">Cadastros</Link> },
    ];
    return <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />;
};

export default SidebarMenu;