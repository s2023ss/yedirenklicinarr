import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Modal, Skeleton } from '@yedirenklicinar/ui-kit';
import { Plus, BookOpen, Edit2, LayoutList, GraduationCap, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { toast } from 'sonner';

export const AcademicStructure: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [newGradeName, setNewGradeName] = useState('');

    const { data: grades, isLoading: gradesLoading } = useQuery({
        queryKey: ['grades'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('grades')
                .select(`
          *,
          courses (*)
        `)
                .order('id');
            if (error) throw error;
            return data;
        },
    });

    const addGradeMutation = useMutation({
        mutationFn: async (name: string) => {
            const { data, error } = await supabase
                .from('grades')
                .insert([{ name }])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grades'] });
            toast.success('Yeni sınıf başarıyla eklendi.');
            setIsGradeModalOpen(false);
            setNewGradeName('');
        },
        onError: (err: any) => {
            toast.error('Sınıf eklenirken bir hata oluştu: ' + err.message);
        }
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Akademik Yapı</h1>
                    <p className="text-slate-500 mt-2 font-medium">Sınıf, ders ve müfredat hiyerarşisini kurumsal standartlarda yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 border-slate-200 bg-white rounded-2xl px-5">
                        <LayoutList size={18} />
                        Toplu İşlemler
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        className="flex items-center gap-2 shadow-xl shadow-primary-500/25 rounded-2xl px-6 py-4"
                        onClick={() => setIsGradeModalOpen(true)}
                    >
                        <Plus size={22} strokeWidth={3} />
                        <span className="text-base text-white">Yeni Sınıf</span>
                    </Button>
                </div>
            </div>

            {/* Content Container */}
            <div className="space-y-10">
                {gradesLoading ? (
                    <div className="space-y-10">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Skeleton width={56} height={56} variant="rectangular" className="rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton width={150} height={24} />
                                        <Skeleton width={100} height={16} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4].map((j) => (
                                        <Card key={j} className="p-6">
                                            <div className="space-y-4">
                                                <Skeleton width={40} height={40} variant="rectangular" className="rounded-2xl" />
                                                <Skeleton variant="text" />
                                                <Skeleton variant="text" width="60%" />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    grades?.map((grade: any) => (
                        <div key={grade.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-primary-500/30">
                                        {grade.name.match(/\d+/)?.[0] || grade.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{grade.name}</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mt-0.5">
                                            <GraduationCap size={16} className="text-primary-500" />
                                            <span>{(grade.courses as any[]).length} AKTİF DERS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 text-slate-400 hover:text-primary-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                                        <Edit2 size={20} />
                                    </button>
                                    <Button variant="primary" size="sm" className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border-none shadow-md">
                                        <Plus size={16} /> Ders Tanımla
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {(grade.courses as any[])?.map((course: any) => (
                                    <Card
                                        key={course.id}
                                        className="group p-6 bg-white border border-slate-100 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer rounded-3xl relative overflow-hidden"
                                        onClick={() => navigate(`/academic/course/${String(course.id)}`)}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-primary-500/10 transition-colors"></div>

                                        <div className="space-y-4 relative z-10">
                                            <div className="flex justify-between items-start">
                                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
                                                    <BookOpen className="text-slate-400 group-hover:text-primary-600 transition-colors" size={24} />
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                                    <ArrowRight size={20} className="text-primary-500" />
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-black text-slate-800 break-words group-hover:text-primary-700 transition-colors">
                                                    {course.name}
                                                </h4>
                                                <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-500 transition-colors">
                                                    Üniteleri ve Kazanımları Yönet
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                {(grade.courses as any[]).length === 0 && (
                                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 group">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                            <Plus size={28} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Henüz ders tanımlanmamış</p>
                                        <button className="mt-4 text-primary-600 font-black text-sm hover:underline">İlk Dersi Ekle</button>
                                    </div>
                                )}
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent pt-4"></div>
                        </div>
                    ))
                )}

                {!gradesLoading && grades?.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary-500/30 rotate-12">
                            <GraduationCap size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">Henüz Veri Girişi Yapılmadı</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-4 font-medium px-6">
                            Akademik yapıyı oluşturmak için ilk sınıfı ve ardından dersleri tanımlayarak başlayın.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-10 px-10 py-5 rounded-2xl shadow-2xl shadow-primary-500/30 font-black tracking-tight"
                            onClick={() => setIsGradeModalOpen(true)}
                        >
                            <Plus size={24} className="mr-2" strokeWidth={3} />
                            İlk Sınıfı Tanımla
                        </Button>
                    </div>
                )}
            </div>

            {/* New Grade Modal */}
            <Modal
                isOpen={isGradeModalOpen}
                onClose={() => setIsGradeModalOpen(false)}
                title="Yeni Sınıf Tanımla"
            >
                <div className="space-y-6 p-2">
                    <Input
                        label="Sınıf İsmi"
                        placeholder="Örn: 12. Sınıf veya Mezun Grubu"
                        value={newGradeName}
                        onChange={(e) => setNewGradeName(e.target.value)}
                        className="py-4 px-5"
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsGradeModalOpen(false)}>Vazgeç</Button>
                        <Button
                            variant="primary"
                            className="px-8"
                            onClick={() => addGradeMutation.mutate(newGradeName)}
                            isLoading={addGradeMutation.isPending}
                            disabled={!newGradeName.trim()}
                        >
                            Tanımla
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
