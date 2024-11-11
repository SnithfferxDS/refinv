import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
    { month: 'Jan', new: 8000, renewal: 4000, churn: 2000 },
    { month: 'Feb', new: 11000, renewal: 3000, churn: 4000 },
    { month: 'Mar', new: 9000, renewal: 5000, churn: 3000 },
    { month: 'Apr', new: 6000, renewal: 4000, churn: 1000 },
    { month: 'May', new: 12000, renewal: 6000, churn: 3000 },
    { month: 'Jun', new: 11000, renewal: 5000, churn: 4000 },
    { month: 'Jul', new: 10000, renewal: 7000, churn: 2000 },
];

const pieData = [
    { name: 'Compras', value: 140 },
    { name: 'ORdenes', value: 102 },
    { name: 'Profit', value: 60 },
    { name: 'Cotizaciones', value: 40 }
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
    return (
        <>
            <div className="flex justify-between items-center mb-8 text-gray-800 dark:text-gray-100">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search transactions, customers..."
                        className="w-96 px-4 py-2 rounded-lg border"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Current MRR', value: '$12.4k', bg: 'bg-primary-500' },
                    { label: 'Current Customers', value: '16,601', bg: 'bg-yellow-500' },
                    { label: 'Active Customers', value: '33%', bg: 'bg-red-400' },
                    { label: 'Churn Rate', value: '2%', bg: 'bg-teal-400' },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} rounded-lg p-6 text-white`}>
                        <h3 className="text-sm opacity-80">{stat.label}</h3>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="new" fill="#2196F3" />
                            <Bar dataKey="renewal" fill="#4CAF50" />
                            <Bar dataKey="churn" fill="#F44336" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Sales Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}