import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface TagihanData {
    sudah_dikonfirmasi: number;
    belum_dikonfirmasi: number;
}

export default function KonfirmasiChart({ title, data }: { title: string; data: TagihanData }) {
    const chartData = [
        { name: 'Sudah Dikonfirmasi', value: data.sudah_dikonfirmasi, color: 'var(--chart-lunas)' },
        { name: 'Belum Dikonfirmasi', value: data.belum_dikonfirmasi, color: 'var(--chart-belum-lunas)' },
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
                            outerRadius={70}
                            innerRadius={40}
                            paddingAngle={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
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
