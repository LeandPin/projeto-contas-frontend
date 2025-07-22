import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space, Spin, Tag, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import apiClient from '../api/axiosConfig';
import dayjs from 'dayjs';

const { Option } = Select;

const LancamentosPage = () => {
    // Estados
    const [lancamentos, setLancamentos] = useState([]);
    const [contas, setContas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    // Busca todos os dados necessários da API
    const fetchData = async () => {
        setLoading(true);
        try {
            const [lancamentosRes, contasRes, categoriasRes] = await Promise.all([
                apiClient.get('/lancamentos'),
                apiClient.get('/contas'),
                apiClient.get('/categorias')
            ]);
            setLancamentos(lancamentosRes.data);
            setContas(contasRes.data);
            setCategorias(categoriasRes.data);
        } catch (error) {
            message.error("Erro ao carregar dados. Verifique a API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Controle do Modal
    const showModal = (record = null) => {
        setEditingRecord(record);
        if (record) {
            // Se estiver editando, converte a data para o formato do dayjs
            form.setFieldsValue({ ...record, data: dayjs(record.data) });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingRecord(null);
    };

    // Lógica de Salvar (Criar/Editar)
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // Formata os dados para enviar para a API (especialmente a data)
            const payload = {
                ...values,
                data: values.data.format('YYYY-MM-DD'),
            };

            if (editingRecord) {
                await apiClient.put(`/lancamentos/${editingRecord.id}`, payload);
                message.success('Lançamento atualizado com sucesso!');
            } else {
                await apiClient.post('/lancamentos', payload);
                message.success('Lançamento criado com sucesso!');
            }
            handleCancel();
            fetchData();
        } catch (error) {
            message.error("Erro ao salvar lançamento!");
        }
    };
    
    // Lógica de Deletar
    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/lancamentos/${id}`);
            message.success("Lançamento excluído com sucesso!");
            fetchData();
        } catch (error) {
            message.error("Erro ao excluir lançamento!");
        }
    };

    // Colunas da Tabela
    const columns = [
        { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
        { title: 'Valor', dataIndex: 'valor', key: 'valor', render: (val) => `R$ ${val.toFixed(2)}` },
        { title: 'Data', dataIndex: 'data', key: 'data', render: (date) => dayjs(date).format('DD/MM/YYYY') },
        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', render: (tipo) => <Tag color={tipo === 'RECEITA' ? 'green' : 'red'}>{tipo}</Tag> },
        { title: 'Conta', dataIndex: ['conta', 'nome'], key: 'conta' },
        { title: 'Categoria', dataIndex: ['categoria', 'nome'], key: 'categoria' },
        {
            title: 'Ações',
            key: 'acoes',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm title="Tem certeza que deseja excluir?" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>
                Novo Lançamento
            </Button>
            <Table dataSource={lancamentos} columns={columns} rowKey="id" />

            <Modal
                title={editingRecord ? "Editar Lançamento" : "Novo Lançamento"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="lancamentoForm">
                    <Form.Item name="descricao" label="Descrição" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="valor" label="Valor" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="data" label="Data" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
                        <Select>
                            <Option value="RECEITA">Receita</Option>
                            <Option value="DESPESA">Despesa</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="contaId" label="Conta" rules={[{ required: true }]}>
                        <Select placeholder="Selecione uma conta">
                            {contas.map(conta => <Option key={conta.id} value={conta.id}>{conta.nome}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="categoriaId" label="Categoria" rules={[{ required: true }]}>
                        <Select placeholder="Selecione uma categoria">
                            {categorias.map(cat => <Option key={cat.id} value={cat.id}>{cat.nome}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    );
};

export default LancamentosPage;