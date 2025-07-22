import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { DashboardOutlined, SwapOutlined, AppstoreAddOutlined } from '@ant-design/icons';

// Define o componente funcional SidebarMenu
const SidebarMenu = () => {
    /*
      Cria um array de objetos para definir a estrutura e o conteúdo do menu.
    */
    const items = [
        { key: '1', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
        { key: '2', icon: <SwapOutlined />, label: <Link to="/lancamentos">Lançamentos</Link> },
        { key: '3', icon: <AppstoreAddOutlined />, label: <Link to="/cadastros">Cadastros</Link> },
    ];
    //retorna o menu ant design
    return <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />;
};

export default SidebarMenu;