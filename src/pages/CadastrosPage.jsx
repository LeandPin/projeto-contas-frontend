import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tabs, Popconfirm, Space, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import apiClient from '../api/axiosConfig'; // Importa nossa configuração do Axios

const { TabPane } = Tabs;
const { Option } = Select;

const CadastrosPage = () => {
    // Estados para guardar os dados, loading e controle do modal
    const [contas, setContas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [currentTab, setCurrentTab] = useState('contas');
    const [form] = Form.useForm();

    // Função para buscar os dados iniciais do back-end
    const fetchData = async () => {
        setLoading(true);
        try {
            const [contasRes, categoriasRes] = await Promise.all([
                apiClient.get('/contas'),
                apiClient.get('/categorias')
            ]);
            setContas(contasRes.data);
            setCategorias(categoriasRes.data);
        } catch (error) {
            message.error("Erro ao carregar dados. Verifique se a API está rodando e acessível.");
            console.error("Detalhes do erro:", error);
        } finally {
            setLoading(false);
        }
    };

    // Roda o fetchData() uma vez quando a página carrega
    useEffect(() => {
        fetchData();
    }, []);

    // Funções de controle do Modal (janela de formulário)
    const showModal = (record = null) => {
        setEditingRecord(record);
        form.setFieldsValue(record ? record : { nome: '', tipo: null });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingRecord(null);
        form.resetFields();
    };

    // Função chamada ao clicar "OK" no formulário (Criação ou Edição)
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const endpoint = currentTab === 'contas' ? '/contas' : '/categorias';

            if (editingRecord) {
                // Modo de Edição
                await apiClient.put(`${endpoint}/${editingRecord.id}`, values);
                message.success(`${currentTab === 'contas' ? 'Conta' : 'Categoria'} atualizada com sucesso!`);
            } else {
                // Modo de Criação
                await apiClient.post(endpoint, values);
                message.success(`${currentTab === 'contas' ? 'Conta' : 'Categoria'} criada com sucesso!`);
            }
            handleCancel();
            fetchData(); // Re-busca os dados para atualizar a tabela
        } catch (error) {
            message.error("Erro ao salvar! Verifique os dados e o console.");
        }
    };

    // Função para deletar um registro
    const handleDelete = async (id) => {
        try {
            const endpoint = currentTab === 'contas' ? '/contas' : '/categorias';
            await apiClient.delete(`${endpoint}/${id}`);
            message.success("Registro excluído com sucesso!");
            fetchData();
        } catch (error) {
            message.error("Erro ao excluir registro!");
        }
    };

    // Definição das colunas para a tabela de Contas
    const colunasConta = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
        {
            title: 'Ações',
            key: 'acoes',
            render: (_, record) => (
                <Space>
                    <Button title="Editar" icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm title="Tem certeza que deseja excluir?" onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não">
                        <Button title="Excluir" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Definição das colunas para a tabela de Categorias
    const colunasCategoria = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        {
            title: 'Ações',
            key: 'acoes',
            render: (_, record) => (
                <Space>
                    <Button title="Editar" icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm title="Tem certeza que deseja excluir?" onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não">
                        <Button title="Excluir" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            <Tabs defaultActiveKey="contas" onChange={(key) => setCurrentTab(key)}>
                <TabPane tab="Contas" key="contas">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>
                        Nova Conta
                    </Button>
                    <Table dataSource={contas} columns={colunasConta} rowKey="id" />
                </TabPane>
                <TabPane tab="Categorias" key="categorias">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>
                        Nova Categoria
                    </Button>
                    <Table dataSource={categorias} columns={colunasCategoria} rowKey="id" />
                </TabPane>
            </Tabs>

            <Modal
                title={editingRecord ? `Editar ${currentTab === 'contas' ? 'Conta' : 'Categoria'}` : `Nova ${currentTab === 'contas' ? 'Conta' : 'Categoria'}`}
                open={isModalVisible} // 'open' é a propriedade correta em versões mais novas do Antd
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose // Limpa o formulário quando o modal é fechado
            >
                <Form form={form} layout="vertical" name="cadastroForm">
                    <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Por favor, insira o nome!' }]}>
                        <Input placeholder="Digite o nome" />
                    </Form.Item>
                    {currentTab === 'contas' && (
                        <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Por favor, selecione o tipo!' }]}>
                            <Select placeholder="Selecione o tipo">
                                <Option value="ATIVO">Ativo</Option>
                                <Option value="PASSIVO">Passivo</Option>
                                <Option value="PATRIMONIO_LIQUIDO">Patrimônio Líquido</Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </Spin>
    );
};

export default CadastrosPage;