import React, {useEffect, useState} from 'react';
import {Menu, Spin} from 'antd';
import axios from "axios";
import CryptoCurrencyCard from "./components/CryptoCurrencyCard.jsx";
const App = () => {
    const [currencies, setCurrencies] = useState([]);
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyData, setCurrencyData] = useState(null);


    const fetchCurrencies = () => {
        axios.get('http://127.0.0.1:8000/currencies/').then((r) => {
            const CurrenciesResponse = r.data;
            const menuItems = [
                {
                    key: 'g1',
                    label: 'Список криптовалют',
                    type: 'group',
                    children: CurrenciesResponse.map(c => {
                        return {label: c.name, key: c.id.toString()}
                    }),
                },
            ];
            setCurrencies(menuItems);
        })
    }

    const fetchCurrencyCrypto = () => {
        axios.get(`http://127.0.0.1:8000/currencies/${currencyId}/quotes`).then((r) => {
            setCurrencyData(r.data);
        })
    }

    useEffect(() => {
        fetchCurrencies()
    }, []);

    useEffect(() => {
        setCurrencyData(null)
        fetchCurrencyCrypto()
    }, [currencyId]);

    const onClick = e => {
        console.log('click ', e);
        setCurrencyId(e.key);
    };
    return (
        <div className={"flex"}>
            <Menu
                onClick={onClick}
                style={{ width: 256 }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={currencies}
                className="h-screen overflow-scroll"
            />
            <div className="mx-auto my-auto">
                {currencyData ? <CryptoCurrencyCard currency={currencyData} /> : <Spin size="large"/>}
            </div>
        </div>
    );
};
export default App;
