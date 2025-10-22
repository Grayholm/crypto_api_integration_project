import { Card, Statistic, Progress, Tag, Row, Col } from "antd";
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    DollarOutlined,
    LineChartOutlined,
    TrophyOutlined,
    GlobalOutlined
} from '@ant-design/icons';

function CryptoCurrencyCard({ currency }) {
    if (!currency) return <p>Loading...</p>;

    // Форматирование чисел
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "-";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: value < 1 ? 4 : 2,
            maximumFractionDigits: value < 1 ? 4 : 2
        }).format(value);
    };

    const formatLargeNumber = (value) => {
        if (value === null || value === undefined) return "-";
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toLocaleString()}`;
    };

    const formatPercent = (value, isPositive = true) => {
        if (value === null || value === undefined) return "-";
        const color = value >= 0 ? "#52c41a" : "#ff4d4f";
        const icon = value >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        return (
            <span style={{ color, fontWeight: 600 }}>
                {icon} {Math.abs(value).toFixed(2)}%
            </span>
        );
    };

    const getRankColor = (rank) => {
        if (rank <= 3) return "gold";
        if (rank <= 10) return "blue";
        if (rank <= 50) return "green";
        return "default";
    };

    const price = currency.quote?.USD?.price;
    const marketCap = currency.quote?.USD?.market_cap;
    const volume24h = currency.quote?.USD?.volume_24h;
    const percentChange1h = currency.quote?.USD?.percent_change_1h;
    const percentChange24h = currency.quote?.USD?.percent_change_24h;
    const percentChange7d = currency.quote?.USD?.percent_change_7d;
    const percentChange30d = currency.quote?.USD?.percent_change_30d;
    const volumeChange24h = currency.quote?.USD?.volume_change_24h;

    // Расчет рыночного доминирования (если доступна общая капитализация)
    const marketDominance = marketCap ? (marketCap / 2500000000000 * 100).toFixed(2) : null; // Примерная общая капитализация

    return (
        <Card
            style={{ width: 800 }}
            className="shadow-2xl rounded-2xl border-0"
            bodyStyle={{ padding: '24px' }}
        >
            {/* Заголовок с основной информацией */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <img
                        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png`}
                        alt={currency.name}
                        className="w-16 h-16 rounded-full"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-3xl">{currency.name}</span>
                            <Tag color={getRankColor(currency.cmc_rank)} className="font-semibold">
                                <TrophyOutlined /> Rank #{currency.cmc_rank}
                            </Tag>
                        </div>
                        <span className="text-gray-500 text-xl font-medium">{currency.symbol}</span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-4xl font-bold text-gray-800">
                        {formatCurrency(price)}
                    </div>
                    <div className={`text-lg font-semibold ${percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(percentChange24h)}
                    </div>
                </div>
            </div>


            {/* Основные метрики */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Statistic
                        title="Рыночная капитализация"
                        value={marketCap}
                        formatter={() => formatLargeNumber(marketCap)}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="24-часовой объем"
                        value={volume24h}
                        formatter={() => formatLargeNumber(volume24h)}
                        prefix={<GlobalOutlined />}
                        valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Полностью размытая рыночная капитализация"
                        value={currency.quote?.USD?.fully_diluted_market_cap}
                        formatter={() => formatLargeNumber(currency.quote?.USD?.fully_diluted_market_cap)}
                        prefix={<LineChartOutlined />}
                        valueStyle={{ color: '#fa8c16', fontSize: '16px' }}
                    />
                </Col>
            </Row>

            {/* Процентные изменения */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Соотношение цены и качества</h3>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card size="small" className="text-center">
                            <div className="text-sm text-gray-600">1Ч</div>
                            <div className="text-lg font-semibold">{formatPercent(percentChange1h)}</div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center">
                            <div className="text-sm text-gray-600">24Ч</div>
                            <div className="text-lg font-semibold">{formatPercent(percentChange24h)}</div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center">
                            <div className="text-sm text-gray-600">7Д</div>
                            <div className="text-lg font-semibold">{formatPercent(percentChange7d)}</div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center">
                            <div className="text-sm text-gray-600">30Д</div>
                            <div className="text-lg font-semibold">{formatPercent(percentChange30d)}</div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Дополнительная информация */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col span={12}>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Circulating Supply</span>
                            <span className="font-semibold">
                                {currency.circulating_supply?.toLocaleString() || '-'} {currency.symbol}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Supply</span>
                            <span className="font-semibold">
                                {currency.total_supply?.toLocaleString() || '∞'} {currency.symbol}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Max Supply</span>
                            <span className="font-semibold">
                                {currency.max_supply?.toLocaleString() || '∞'} {currency.symbol}
                            </span>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Volume Change 24h</span>
                            <span className="font-semibold">
                                {volumeChange24h ? `${volumeChange24h.toFixed(2)}%` : '-'}
                            </span>
                        </div>
                        {marketDominance && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Market Dominance</span>
                                <span className="font-semibold">{marketDominance}%</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="font-semibold text-sm">
                                {new Date(currency.last_updated).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Прогресс бар для циркулирующего supply (если есть max_supply) */}
            {currency.max_supply && currency.circulating_supply && (
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Supply Progress</span>
                        <span>{((currency.circulating_supply / currency.max_supply) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                        percent={((currency.circulating_supply / currency.max_supply) * 100)}
                        showInfo={false}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>
            )}
        </Card>
    );
}

export default CryptoCurrencyCard;
