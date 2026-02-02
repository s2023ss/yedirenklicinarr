import React from 'react';
import { Card, Skeleton } from '@yedirenklicinar/ui-kit';
import { Users, BookOpen, HelpCircle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';

export const Dashboard: React.FC = () => {
    // Fetch Student Count
    const { data: studentCount, isLoading: isStudentLoading } = useQuery({
        queryKey: ['count', 'students'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student');
            if (error) throw error;
            return count || 0;
        }
    });

    // Fetch Course Count
    const { data: courseCount, isLoading: isCourseLoading } = useQuery({
        queryKey: ['count', 'courses'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('courses')
                .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
        }
    });

    // Fetch Question Count
    const { data: questionCount, isLoading: isQuestionLoading } = useQuery({
        queryKey: ['count', 'questions'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('questions')
                .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count || 0;
        }
    });

    const stats = [
        { label: 'Toplam Öğrenci', value: studentCount, isLoading: isStudentLoading, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Aktif Dersler', value: courseCount, isLoading: isCourseLoading, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Soru Sayısı', value: questionCount, isLoading: isQuestionLoading, icon: HelpCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Başarı Oranı', value: 86, isLoading: false, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', prefix: '%' },
    ];

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <div className="animate-in slide-in-from-top-4 duration-700">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Panoya Genel Bakış</h1>
                <p className="text-slate-500 mt-3 font-bold text-lg tracking-tight">Akademi'deki son gelişmeleri ve istatistikleri takip edin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                        <Card className="hover:border-primary-100 transition-all duration-300">
                            <div className="space-y-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-sm`}>
                                    <stat.icon size={28} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                    {stat.isLoading ? (
                                        <Skeleton width={80} height={40} />
                                    ) : (
                                        <p className="text-4xl font-black text-slate-900 tracking-tight">
                                            {stat.prefix}{stat.value}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="p-10 border-slate-100 min-h-[450px] flex flex-col items-center justify-center border-2 border-dashed bg-white rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-100 transition-all group-hover:scale-110 group-hover:text-primary-200">
                            <TrendingUp size={48} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-900 font-black text-xl tracking-tight">Performans Analizi</p>
                            <p className="text-slate-400 text-sm max-w-[280px] mx-auto font-bold leading-relaxed">Sınav sonuçlarına göre kişiselleştirilmiş öğrenci gelişim grafikleri yakında burada olacak.</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-10 border-slate-100 min-h-[450px] flex flex-col items-center justify-center border-2 border-dashed bg-white rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-100 transition-all group-hover:scale-110 group-hover:text-indigo-200">
                            <BookOpen size={48} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-900 font-black text-xl tracking-tight">Aktivite Akışı</p>
                            <p className="text-slate-400 text-sm max-w-[280px] mx-auto font-bold leading-relaxed">Öğrencilerin çözdüğü son testler ve kazanım durumları anlık olarak burada takip edilecek.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
