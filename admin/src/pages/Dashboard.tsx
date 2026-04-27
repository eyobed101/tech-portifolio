import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const data = [
    { name: 'Jul 1', value: 30000 },
    { name: 'Jul 7', value: 65000 },
    { name: 'Jul 14', value: 76000 },
    { name: 'Jul 21', value: 50000 },
    { name: 'Jul 28', value: 80000 },
];

const barData = [
    { name: '22', a: 400, b: 240 },
    { name: '23', a: 300, b: 139 },
    { name: '24', a: 200, b: 980 },
    { name: '25', a: 278, b: 390 },
    { name: '26', a: 189, b: 480 },
    { name: '27', a: 239, b: 380 },
    { name: '28', a: 349, b: 430 },
];

const pieData = [
    { name: 'A', value: 400, color: '#e5e7eb' },
    { name: 'B', value: 300, color: '#fcd34d' },
    { name: 'C', value: 300, color: '#86efac' },
    { name: 'D', value: 200, color: '#1f2937' },
];

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Main Charts) */}
            <div className="lg:col-span-2 space-y-6">

                {/* Main Area Chart */}
                <div className="bg-[#141a23] rounded-2xl p-6 border border-[#1f2937] shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-400 font-medium text-sm">CDN usage</h3>
                            <p className="text-xs text-gray-500 mt-1">Last 28 days</p>
                        </div>
                        <div className="text-xl font-bold text-white tracking-wide">8.25 KB</div>
                    </div>
                    <div className="h-64 mt-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}K`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#e2e8f0" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Row inside left column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Data Transfer Line Chart */}
                    <div className="bg-[#141a23] rounded-2xl p-6 border border-[#1f2937]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-gray-400 font-medium text-sm">Data transfer</h3>
                                <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                            </div>
                            <div className="text-lg font-bold text-white">8.25 KB</div>
                        </div>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" hide />
                                    <Tooltip contentStyle={{ display: 'none' }} />
                                    <Area type="monotone" dataKey="value" stroke="#e2e8f0" strokeWidth={2} fillOpacity={1} fill="url(#colorVal2)" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>Jul 22</span>
                                <span>23</span>
                                <span>24</span>
                                <span>25</span>
                                <span>26</span>
                                <span>27</span>
                                <span>28</span>
                            </div>
                        </div>
                    </div>

                    {/* Unique Visits Bar Chart */}
                    <div className="bg-[#141a23] rounded-2xl p-6 border border-[#1f2937]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-gray-400 font-medium text-sm">Unique visits</h3>
                                <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                            </div>
                            <div className="text-lg font-bold text-white">1642</div>
                        </div>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} barCategoryGap="20%">
                                    <Tooltip cursor={{ fill: '#1f2937' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px', color: '#fff' }} />
                                    <Bar dataKey="a" fill="#e5e7eb" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="b" fill="#fcd34d" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>Jul 22</span>
                                <span>23</span>
                                <span>24</span>
                                <span>25</span>
                                <span>26</span>
                                <span>27</span>
                                <span>28</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

                {/* Your Sites List */}
                <div className="bg-[#141a23] rounded-2xl p-6 border border-[#1f2937]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-gray-200 font-medium">Your Sites</h3>
                        <button className="text-xs text-gray-400 hover:text-white transition-colors">View all</button>
                    </div>
                    <div className="flex text-xs text-gray-500 mb-4 border-b border-[#1f2937] pb-2">
                        <div className="flex-1">Name</div>
                        <div>Visit</div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="text-sm text-gray-200 font-medium group-hover:text-white">UI KIT</p>
                                <p className="text-xs text-gray-500 mt-0.5">www.uikit.to</p>
                            </div>
                            <div className="text-sm text-gray-400">199,452,201</div>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="text-sm text-gray-200 font-medium group-hover:text-white">UI Design</p>
                                <p className="text-xs text-gray-500 mt-0.5">www.uidesign.to</p>
                            </div>
                            <div className="text-sm text-gray-400">906,400,25</div>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="text-sm text-gray-200 font-medium group-hover:text-white">Bexon</p>
                                <p className="text-xs text-gray-500 mt-0.5">www.bexon.agency</p>
                            </div>
                            <div className="text-sm text-gray-400">152,624,001</div>
                        </div>
                    </div>
                </div>

                {/* Resource Usage Pie Chart */}
                <div className="bg-[#141a23] rounded-2xl p-6 border border-[#1f2937]">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-gray-200 font-medium">Resource Usage</h3>
                        <p className="text-xs text-gray-500">Last 28 days</p>
                    </div>
                    <div className="h-48 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-[#0e121a] p-3 rounded-lg border border-[#1f2937]">
                            <p className="text-xs text-gray-500 mb-1">Disk Usage</p>
                            <div className="flex items-center">
                                <div className="w-1 h-3 bg-gray-300 rounded-full mr-2"></div>
                                <p className="text-xs font-medium text-gray-300">3 GB out of 10 GB</p>
                            </div>
                        </div>
                        <div className="bg-[#0e121a] p-3 rounded-lg border border-[#1f2937]">
                            <p className="text-xs text-gray-500 mb-1">CDN Usage</p>
                            <div className="flex items-center">
                                <div className="w-1 h-3 bg-gray-300 rounded-full mr-2"></div>
                                <p className="text-xs font-medium text-gray-300">73 MB out of 1 GB</p>
                            </div>
                        </div>
                        <div className="bg-[#0e121a] p-3 rounded-lg border border-[#1f2937]">
                            <p className="text-xs text-gray-500 mb-1">Visits</p>
                            <div className="flex items-center">
                                <div className="w-1 h-3 bg-green-300 rounded-full mr-2"></div>
                                <p className="text-xs font-medium text-gray-300">356 out of 242,540</p>
                            </div>
                        </div>
                        <div className="bg-[#0e121a] p-3 rounded-lg border border-[#1f2937]">
                            <p className="text-xs text-gray-500 mb-1">This month</p>
                            <div className="flex items-center">
                                <div className="w-1 h-3 bg-gray-300 rounded-full mr-2"></div>
                                <p className="text-xs font-medium text-gray-300">Day 31 out of 31</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
