
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Log } from '../../types/Log';

interface VehicleStatProps {
  logs: Log[];
}

interface ChartData {
    name: string;
    count: number;
}

const VehicleStats: React.FC<VehicleStatProps> = ({ logs }) => {
  const data = logs.reduce((acc: ChartData[], log) => {
    const vehicleType = log.vehicle.vehicleType;
    const existing = acc.find((item) => item.name === vehicleType);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: vehicleType, count: 1 });
    }
    return acc;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Entry Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="var(--color-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VehicleStats;