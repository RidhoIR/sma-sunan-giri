import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface TagihanData {
    lunas: number;
    belum_lunas: number;
    belum_bayar: number;
}

export default function TagihanPie({ title, data }: { title: string; data: TagihanData }) {
    const chartData = [
        { name: 'Lunas', value: data.lunas, color: 'var(--chart-lunas)' },
        { name: 'Belum Lunas', value: data.belum_lunas, color: 'var(--chart-belum-lunas)' },
        { name: 'Belum Bayar', value: data.belum_bayar, color: 'var(--chart-belum-bayar)' },
    ];

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => new Intl.NumberFormat('id-ID').format(value)} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex gap-4">
                    {chartData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                            <span>{entry.name}</span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}
