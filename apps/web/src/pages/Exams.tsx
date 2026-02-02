import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { Card, Button } from '@yedirenklicinar/ui-kit';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, ClipboardList, Clock, CheckCircle2, XCircle, Trash2, Calendar, Users, GraduationCap } from 'lucide-react';

export const Exams: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch Exams (Tests)
    const { data: exams, isLoading, error } = useQuery({
        queryKey: ['exams'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tests')
                .select(`
                    *,
                    test_questions (count),
                    test_assignments (
                        grade_id,
                        student_id,
                        grades (name),
                        profiles (full_name)
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('tests')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Sınav başarıyla silindi.');
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
        onError: (err: any) => {
            toast.error('Sınav silinirken bir hata oluştu: ' + err.message);
        }
    });

    const handleDelete = (id: number) => {
        if (window.confirm('Bu sınavı silmek istediğinize emin misiniz?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center sm:text-left">Sınav Yönetimi</h1>
                    <p className="text-slate-500 mt-2 font-medium text-center sm:text-left">Sınavları oluşturun, yönetin ve öğrenci performanslarını takip edin.</p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    className="flex items-center gap-3 shadow-xl shadow-primary-500/25 rounded-2xl px-8 py-4 font-black w-full sm:w-auto text-white"
                    onClick={() => navigate('/exams/new')}
                >
                    <Plus size={22} strokeWidth={3} />
                    Yeni Sınav Oluştur
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Sınavlar yükleniyor...</p>
                </div>
            ) : error ? (
                <Card className="p-12 border-red-100 bg-red-50 text-center rounded-[2rem]">
                    <p className="text-red-700 font-bold">Sınav listesi alınırken bir hata oluştu.</p>
                </Card>
            ) : exams && exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exams.map((exam, i) => (
                        <Card key={String(exam.id)} className="p-0 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <ClipboardList size={28} />
                                    </div>
                                    <div className="flex gap-2">
                                        {exam.is_active ? (
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                <CheckCircle2 size={12} /> Aktif
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                <XCircle size={12} /> Taslak
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 group-hover:text-primary-600 transition-colors uppercase">{exam.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} /> {exam.duration_minutes} Dakika
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ClipboardList size={16} /> {exam.test_questions?.[0]?.count || 0} Soru
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} /> {new Date(exam.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assignments Summary */}
                                    <div className="pt-4 border-t border-slate-50 space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Users size={12} /> Atanan Hedefler
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {exam.test_assignments?.map((as: any, idx: number) => (
                                                <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">
                                                    {as.grade_id ? <GraduationCap size={10} /> : <Users size={10} />}
                                                    {as.grades?.name || as.profiles?.full_name}
                                                </span>
                                            ))}
                                            {(!exam.test_assignments || exam.test_assignments.length === 0) && (
                                                <span className="text-[10px] font-bold text-slate-300 italic">Henüz bir atama yapılmamış</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-3 border-t border-slate-50">
                                    <Button variant="outline" className="flex-1 rounded-xl font-bold py-3 text-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all">Düzenle</Button>
                                    <button
                                        onClick={() => handleDelete(exam.id)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-12 border-none shadow-sm bg-white/50 backdrop-blur-sm text-center space-y-6 animate-in zoom-in-95 rounded-[3rem]">
                    <div className="w-24 h-24 bg-primary-100/50 text-primary-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                        <ClipboardList size={48} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800">Henüz Sınav Bulunmuyor</h3>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">
                            Henüz tanımlanmış bir sınav yok. Yeni bir sınav oluşturarak öğrencilerinize başarılarını ölçme şansı verin.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Button
                            variant="primary"
                            className="gap-3 rounded-2xl px-10 py-5 font-black shadow-xl shadow-primary-500/20 text-white"
                            onClick={() => navigate('/exams/new')}
                        >
                            <Plus size={20} strokeWidth={3} /> İlk Sınavı Oluştur
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};
