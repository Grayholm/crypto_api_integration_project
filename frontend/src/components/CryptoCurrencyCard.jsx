import { Card } from "antd";
import "./CryptoCurrencyCard.css"; // Для шрифта

function CryptoCurrencyCard({ currency }) {
    if (!currency) return <p>Loading...</p>;

    const price = currency.quote?.USD?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "-";
    const marketCap = currency.quote?.USD?.market_cap?.toLocaleString() ?? "-";
    const volume24h = currency.quote?.USD?.volume_24h?.toLocaleString() ?? "-";

    const formatPercent = (value) => {
        if (value === null || value === undefined) return "-";
        const color = value >= 0 ? "text-green-600" : "text-red-600";
        return <span className={`${color} font-semibold`}>{value.toFixed(2)}%</span>;
    };

    return (
        <Card
            style={{ width: 400 }}
            className="p-6 font-inter shadow-xl"
        >
            {/* Заголовок */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png`}
                    alt={currency.name}
                    className="w-14 h-14"
                />
                <div className="flex flex-col">
                    <span className="font-bold text-2xl">{currency.name}</span>
                    <span className="text-gray-500 text-lg">{currency.symbol}</span>
                </div>
            </div>

            {/* Основная информация */}
            <p className="text-gray-700 text-2xl font-semibold">Цена: ${price}</p>
            <p className="text-gray-700 text-lg">Рыночная капитализация: ${marketCap}</p>
            <p className="text-gray-700 text-lg">Объём 24ч: ${volume24h}</p>

            {/* Процент изменения */}
            <div className="flex gap-6 mt-4 text-lg">
                <p>1ч: {formatPercent(currency.quote?.USD?.percent_change_1h)}</p>
                <p>24ч: {formatPercent(currency.quote?.USD?.percent_change_24h)}</p>
                <p>7д: {formatPercent(currency.quote?.USD?.percent_change_7d)}</p>
            </div>
        </Card>
    );
}

export default CryptoCurrencyCard;
