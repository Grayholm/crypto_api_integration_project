import React, { useEffect, useState } from 'react';
import { Menu, Spin, Layout, Typography } from 'antd';
import axios from "axios";
import CryptoCurrencyCard from "./components/CryptoCurrencyCard.jsx";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App = () => {
    const [currencies, setCurrencies] = useState([]);
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyData, setCurrencyData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrencies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/currencies/');
            const currenciesData = response.data;

            const menuItems = [
                {
                    key: 'g1',
                    label: '💰 Список криптовалют',
                    type: 'group',
                    children: currenciesData.map(c => ({
                        label: (
                            <div className="flex items-center justify-between">
                                <span>{c.name}</span>
                                <span className="text-gray-400 text-xs">{c.symbol}</span>
                            </div>
                        ),
                        key: c.id.toString(),
                    })),
                },
            ];
            setCurrencies(menuItems);
        } catch (error) {
            console.error('Error fetching currencies:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCurrencyCrypto = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/currencies/${currencyId}`);
            setCurrencyData(response.data);
        } catch (error) {
            console.error('Error fetching currency data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (currencyId) {
            setCurrencyData(null);
            fetchCurrencyCrypto();
        }
    }, [currencyId]);

    const onClick = e => {
        setCurrencyId(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={300}
                theme="light"
                className="border-r border-gray-200"
            >
                <div className="p-4 border-b border-gray-200">
                    <Title level={3} className="!mb-0 text-blue-600">
                        Крипто Трекер
                    </Title>
                    <p className="text-gray-500 text-sm">Текущие данные о криптовалюте</p>
                </div>

                <Menu
                    onClick={onClick}
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={currencies}
                    className="h-screen overflow-scroll"
                    loading={loading}
                />
            </Sider>

            <Layout>
                <Header className="bg-white border-b border-gray-200 px-6">
                    <div className="flex items-center justify-between h-full">
                        <Title level={2} className="!mb-0 !text-white">
                            {currencyData ? `${currencyData.name} (${currencyData.symbol})` : 'Loading...'}
                        </Title>
                        <div className="text-sm text-gray-500">
                            Данные CoinMarketCap в реальном времени
                        </div>
                    </div>
                </Header>

                <Content className="p-8 bg-gray-50">
                    <div className="flex justify-center">
                        {loading ? (
                            <div className="text-center py-20">
                                <Spin size="large" />
                                <p className="mt-4 text-gray-600">Загрузка данных криптовалюты...</p>
                            </div>
                        ) : currencyData ? (
                            <CryptoCurrencyCard currency={currencyData} />
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-600">Выберите криптовалюту для просмотра подробностей</p>
                            </div>
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;