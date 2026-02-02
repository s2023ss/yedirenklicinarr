import React from 'react';
import { Card, Skeleton } from '@yedirenklicinar/ui-kit';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { TrendingUp, Target, PieChart as PieIcon } from 'lucide-react';

export const Reports: React.FC = () => {
    // Fetch outcome mastery data
    const { data: masteryData, isLoading: isMasteryLoading } = useQuery({
        queryKey: ['reports', 'mastery'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('exec_sql', {
                sql_query: "SELECT row_to_json(t) FROM (SELECT topic_name as name, average_score as score, attempts_count as count FROM public.vw_student_outcome_mastery LIMIT 10) t"
            });
            if (error) throw error;
            return data?.map((item: any) => item.row_to_json) || [];
        }
    });

    // Fetch class performance
    const { data: classData, isLoading: isClassLoading } = useQuery({
        queryKey: ['reports', 'classes'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('exec_sql', {
                sql_query: "SELECT row_to_json(t) FROM (SELECT grade_name as name, average_score as score FROM public.vw_class_performance) t"
            });
            if (error) throw error;
            return data?.map((item: any) => item.row_to_json) || [];
        }
    });

    const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff', '#f5f7ff'];

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <div className="animate-in slide-in-from-top-4 duration-700">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Analiz Panosu</h1>
                <p className="text-slate-500 mt-3 font-bold text-lg tracking-tight">Eğitim verilerini ve başarı grafiklerini takip edin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Topic Mastery Chart */}
                <Card
                    title={
                        <div className="flex items-center space-x-3">
                            <Target className="text-primary-500" size={24} />
                            <span>Konu Bazlı Başarı Oranları</span>
                        </div>
                    }
                    className="min-h-[450px]"
                >
                    {isMasteryLoading ? (
                        <div className="space-y-4">
                            <Skeleton height={300} />
                        </div>
                    ) : (
                        <div className="h-[350px] w-full pt-4 min-h-[350px]">
                            {masteryData && masteryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={masteryData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="score" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 font-bold">Henüz veri bulunmuyor.</div>
                            )}
                        </div>
                    )}
                </Card>

                {/* Class Performance Chart */}
                <Card
                    title={
                        <div className="flex items-center space-x-3">
                            <PieIcon className="text-indigo-500" size={24} />
                            <span>Sınıf Bazlı İlerleme</span>
                        </div>
                    }
                    className="min-h-[450px]"
                >
                    {isClassLoading ? (
                        <Skeleton height={300} />
                    ) : (
                        <div className="h-[350px] w-full pt-4 min-h-[350px]">
                            {classData && classData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={classData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="score"
                                        >
                                            {classData.map((_: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 font-bold">Henüz veri bulunmuyor.</div>
                            )}
                        </div>
                    )}
                </Card>

                {/* Growth Trend */}
                <Card
                    title={
                        <div className="flex items-center space-x-3">
                            <TrendingUp className="text-emerald-500" size={24} />
                            <span>Haftalık Gelişim Trendi</span>
                        </div>
                    }
                    className="lg:col-span-2 min-h-[450px]"
                >
                    <div className="h-[350px] w-full pt-4 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Pzt', score: 65 },
                                { name: 'Sal', score: 72 },
                                { name: 'Çar', score: 68 },
                                { name: 'Per', score: 85 },
                                { name: 'Cum', score: 78 },
                                { name: 'Cmt', score: 92 },
                                { name: 'Paz', score: 88 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
