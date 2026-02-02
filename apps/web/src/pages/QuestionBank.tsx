import React from 'react';
import { Card, Button, Skeleton } from '@yedirenklicinar/ui-kit';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, BookOpen, HelpCircle, Inbox, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { Modal } from '@yedirenklicinar/ui-kit';
import { toast } from 'sonner';

export const QuestionBank: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = React.useState<number | null>(null);
    const { data: questions, isLoading, error } = useQuery({
        queryKey: ['questions'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('questions')
                .select(`
          *,
          learning_outcomes (
            description,
            topic_id,
            topics (
              name,
              units (
                name,
                courses (name)
              )
            )
          )
        `)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('questions').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            toast.success('Soru başarıyla silindi.');
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error('Silme işlemi başarısız: ' + error.message);
        }
    });

    const handleDelete = async () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Soru Bankası</h1>
                    <p className="text-slate-500 mt-2 font-medium">Sistemdeki tüm soruları yönetin, yeni sorular ekleyin ve filtreleyin.</p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    className="flex items-center gap-2 shadow-xl shadow-primary-500/25 rounded-2xl px-6 py-4"
                    onClick={() => navigate('/questions/new')}
                >
                    <Plus size={22} strokeWidth={3} />
                    <span className="text-base text-white">Yeni Soru Ekle</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 border-none shadow-sm bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Sorularda ara..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none text-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex items-center gap-2 rounded-2xl border-slate-200 bg-white">
                            <Filter size={18} />
                            Filtrele
                        </Button>
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer shadow-sm transition-all">
                            <BookOpen size={20} />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Question List */}
            <div className="grid gap-6">
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-6 border-slate-100">
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Skeleton width={80} height={20} variant="rectangular" className="rounded-full" />
                                        <Skeleton width={60} height={20} variant="rectangular" className="rounded-full" />
                                    </div>
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" width="80%" />
                                    <div className="flex gap-4">
                                        <Skeleton width={120} height={32} />
                                        <Skeleton width={180} height={32} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : error ? (
                    <Card className="p-8 border-red-100 bg-red-50/50 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <HelpCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-red-900">Veri Yükleme Hatası</h3>
                        <p className="text-red-700 max-w-md mx-auto">Veritabanı bağlantısı sırasında bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.</p>
                        <code className="block p-3 bg-white/50 rounded-lg text-xs text-red-500 overflow-x-auto">{(error as any).message}</code>
                        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => window.location.reload()}>Tekrar Dene</Button>
                    </Card>
                ) : questions && questions.length > 0 ? (
                    questions.map((question: any) => {
                        // Robust data extractor
                        const outcome = question.learning_outcomes;
                        const topic = outcome?.topics;
                        const unit = topic?.units;
                        const course = unit?.courses;
                        const courseName = course?.name || 'Ders Belirtilmemiş';
                        const outcomeDesc = outcome?.description || 'Kazanım Belirtilmemiş';

                        return (
                            <Card key={question.id} className="group p-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${question.difficulty_level <= 2 ? 'bg-green-100 text-green-700' :
                                                question.difficulty_level <= 3 ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {question.difficulty_level === 1 ? 'Çok Kolay' :
                                                    question.difficulty_level === 2 ? 'Kolay' :
                                                        question.difficulty_level === 3 ? 'Orta' :
                                                            question.difficulty_level === 4 ? 'Zor' : 'Çok Zor'}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <HelpCircle size={14} />
                                                ID: #{question.id}
                                            </span>
                                        </div>

                                        <p className="text-lg font-bold text-slate-800 leading-relaxed group-hover:text-slate-900 transition-colors">
                                            {question.content}
                                        </p>

                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl">
                                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                                <span className="text-xs font-bold text-slate-600">
                                                    {courseName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                                <span className="text-xs font-bold text-slate-500">
                                                    {outcomeDesc}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col justify-end gap-2 shrink-0">
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => navigate(`/questions/edit/${question.id}`)}>Düzenle</Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="rounded-xl font-bold bg-red-50 text-red-600 border-none hover:bg-red-600 hover:text-white"
                                            onClick={() => setDeleteId(question.id)}
                                        >
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary-500/30 rotate-12">
                            <Inbox size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Soru Bulunamadı</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-4 font-medium px-6">
                            Sistemde henüz kayıtlı soru yok. Hemen yeni bir soru hazırlamaya ne dersiniz?
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-10 px-10 py-5 rounded-2xl shadow-2xl shadow-primary-500/30 font-black tracking-tight"
                            onClick={() => navigate('/questions/new')}
                        >
                            <Plus size={24} className="mr-2" strokeWidth={3} />
                            İlk Soruyu Hazırla
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Soruyu Sil"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-red-900 font-bold">Bu işlemi onaylıyor musunuz?</p>
                            <p className="text-red-700 text-sm">Bu soru kalıcı olarak silinecek ve geri alınamaz.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setDeleteId(null)} className="font-bold">
                            Vazgeç
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteMutation.isPending}
                            className="px-8 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-500/20"
                        >
                            Evet, Sil
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
