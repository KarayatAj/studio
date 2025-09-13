'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '@/hooks/use-auth';
import { JournalEntry } from '@/lib/types';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import LoadingSpinner from './loading-spinner';

const chartConfig = {
  reflectionScore: {
    label: 'Reflection Score',
    color: 'hsl(var(--primary))',
  },
};

export default function ProgressChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const entriesQuery = query(
      collection(db, 'users', user.uid, 'journal_entries'),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(entriesQuery, (querySnapshot) => {
      const entries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JournalEntry[];

      const formattedData = entries.map((entry) => ({
        date: format((entry.date as Timestamp).toDate(), 'MMM d'),
        reflectionScore: entry.reflectionScore,
      }));
      setChartData(formattedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <TrendingUp className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="font-headline text-2xl">Your Progress</CardTitle>
                <CardDescription>
                Visualizing your reflection journey over time.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[350px] w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickMargin={10}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="reflectionScore"
                type="monotone"
                stroke="var(--color-reflectionScore)"
                strokeWidth={2}
                dot={{
                  fill: 'var(--color-reflectionScore)',
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[350px] flex-col items-center justify-center text-center text-muted-foreground">
            <p>Not enough data to display chart.</p>
            <p className="text-sm">Start journaling to see your progress.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
