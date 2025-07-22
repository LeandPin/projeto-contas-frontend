import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd'; //ant design

// Importações com os caminhos simplificados e corretos
import SidebarMenu from './components/SidebarMenu';
import DashboardPage from './pages/DashboardPage';
import LancamentosPage from './pages/LancamentosPage';
import CadastrosPage from './pages/CadastrosPage';

const { Sider, Content } = Layout;

function App() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
           {/* Cria a barra lateral
            */}
         
        <Sider collapsible>
            <div className="logo-container" style={{ padding: '24px', textAlign: 'center' }}>
                <img src="/Logo.png" alt="Logo da Empresa" style={{ maxWidth: '90%', height: 'auto' }} />
            </div>
           
            {/*renderiza o menu com os links navegaveis*/}
            <SidebarMenu />
        </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
                    <Routes>
                        {/*Renderiza a pagina específica*/}
                        
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/lancamentos" element={<LancamentosPage />} />
                        <Route path="/cadastros" element={<CadastrosPage />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;