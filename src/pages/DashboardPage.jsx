import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, message, Spin, Tag, DatePicker } from 'antd'; // 1. Importar DatePicker
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '../api/axiosConfig';
import dayjs from 'dayjs';

const { Title } = Typography;

const DashboardPage = () => {
    // Estados
    const [stats, setStats] = useState({ receitasMes: 0, despesasMes: 0, balancoMes: 0 });
    const [recentesLancamentos, setRecentesLancamentos] = useState([]);
    const [despesasPorCategoria, setDespesasPorCategoria] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allLancamentos, setAllLancamentos] = useState([]); // Guarda todos os lançamentos
    const [selectedDate, setSelectedDate] = useState(dayjs()); // 2. Novo estado para a data

    // Função que processa os dados, agora recebe a data como parâmetro
    const processData = (lancamentos, dataSelecionada) => {
        let receitas = 0;
        let despesas = 0;
        const gastosCategoria = {};

        // Filtra lançamentos para o mês e ano da data SELECIONADA
        const lancamentosDoMes = lancamentos.filter(l => dayjs(l.data).isSame(dataSelecionada, 'month'));

        lancamentosDoMes.forEach(l => {
            if (l.tipo === 'RECEITA') {
                receitas += l.valor;
            } else {
                despesas += l.valor;
                const categoriaNome = l.categoria.nome;
                if (gastosCategoria[categoriaNome]) {
                    gastosCategoria[categoriaNome] += l.valor;
                } else {
                    gastosCategoria[categoriaNome] = l.valor;
                }
            }
        });

        const dadosGrafico = Object.keys(gastosCategoria).map(nome => ({
            name: nome,
            value: parseFloat(gastosCategoria[nome].toFixed(2))
        }));
        
        setStats({
            receitasMes: receitas,
            despesasMes: despesas,
            balancoMes: receitas - despesas
        });
        setDespesasPorCategoria(dadosGrafico);
    };

    // useEffect para buscar os dados da API apenas UMA VEZ
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/lancamentos');
                setAllLancamentos(response.data); // Guarda todos os lançamentos
                processData(response.data, selectedDate); // Processa os dados para o mês atual
                
                // Pega os 5 lançamentos mais recentes de todos os tempos
                const sortedLancamentos = [...response.data].sort((a, b) => new Date(b.data) - new Date(a.data));
                setRecentesLancamentos(sortedLancamentos.slice(0, 5));
            } catch (error) {
                message.error("Não foi possível carregar os dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Array de dependências vazio, roda só uma vez

    // Função para quando o usuário muda o mês
    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
            processData(allLancamentos, date); // Re-processa os dados já existentes com a nova data
        }
    };
    
    // ... (código das colunas e cores continua o mesmo) ...
   const colunasLancamentosRecentes = [
    {
        title: 'Data',
        dataIndex: 'data',
        key: 'data',
        render: (data) => dayjs(data).format('DD/MM/YYYY') // Formata a data
    },
    {
        title: 'Descrição',
        dataIndex: 'descricao',
        key: 'descricao'
    },
    {
        title: 'Conta',
        dataIndex: ['conta', 'nome'], // Acessa o nome dentro do objeto conta
        key: 'conta'
    },
    {
        title: 'Valor',
        dataIndex: 'valor',
        key: 'valor',
        render: (val) => `R$ ${val.toFixed(2)}`
    },
    {
        title: 'Tipo',
        dataIndex: 'tipo',
        key: 'tipo',
        render: (tipo) => <Tag color={tipo === 'RECEITA' ? 'green' : 'red'}>{tipo}</Tag>
    },
];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <Spin spinning={loading}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={2}>Dashboard Financeiro</Title>
                </Col>
                <Col>
                    {/* 3. Adiciona o seletor de mês aqui */}
                    <DatePicker picker="month" onChange={handleDateChange} defaultValue={selectedDate} />
                </Col>
            </Row>

            {/* O resto do código (Cards, Gráfico, Tabela) continua o mesmo */}
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={8}><Card><Statistic title="Receitas do Mês" value={stats.receitasMes} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} suffix="R$" /></Card></Col>
                <Col span={8}><Card><Statistic title="Despesas do Mês" value={stats.despesasMes} precision={2} valueStyle={{ color: '#cf1322' }} prefix={<ArrowDownOutlined />} suffix="R$" /></Card></Col>
                <Col span={8}><Card><Statistic title="Balanço do Mês" value={stats.balancoMes} precision={2} valueStyle={{ color: stats.balancoMes >= 0 ? '#3f8600' : '#cf1322' }} prefix="R$" /></Card></Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="Despesas por Categoria (Mês Selecionado)">
                        <ResponsiveContainer width="100%" height={300}>
                            {despesasPorCategoria.length > 0 ? (
                                <PieChart><Pie data={despesasPorCategoria} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>{despesasPorCategoria.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} /><Legend /></PieChart>
                            ) : (<p>Nenhuma despesa registrada no mês selecionado.</p>)}
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Últimos Lançamentos (Geral)">
                        <Table columns={colunasLancamentosRecentes} dataSource={recentesLancamentos} rowKey="id" pagination={false} />
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
};

export default DashboardPage;