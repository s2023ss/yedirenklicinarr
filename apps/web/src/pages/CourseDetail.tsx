import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Modal, Skeleton } from '@yedirenklicinar/ui-kit';
import { ArrowLeft, Plus, Edit2, Book, Layers } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { toast } from 'sonner';

export const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select(`
                    *,
                    grades (name),
                    units (
                        *,
                        topics (
                            *,
                            learning_outcomes (*)
                        )
                    )
                `)
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!id
    });

    const addUnitMutation = useMutation({
        mutationFn: async (name: string) => {
            const { data, error } = await supabase
                .from('units')
                .insert([{ course_id: parseInt(id!), name }])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', id] });
            toast.success('Yeni ünite başarıyla eklendi.');
            setIsUnitModalOpen(false);
            setNewUnitName('');
        },
        onError: (err: any) => {
            toast.error('Ünite eklenirken bir hata oluştu: ' + err.message);
        }
    });

    if (isLoading) return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <div className="space-y-6">
                <Skeleton width={150} height={20} />
                <div className="flex justify-between items-end">
                    <div className="space-y-3">
                        <Skeleton width={200} height={24} />
                        <Skeleton width={300} height={48} />
                    </div>
                    <Skeleton width={160} height={48} variant="rectangular" className="rounded-2xl" />
                </div>
            </div>
            <div className="grid gap-8">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton width={48} height={48} variant="rectangular" className="rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton width={200} height={24} />
                                <Skeleton width={100} height={16} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((j) => (
                                <Card key={j} className="p-5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Skeleton width={32} height={32} variant="rectangular" className="rounded-lg" />
                                            <Skeleton width={120} height={20} />
                                        </div>
                                        <Skeleton width={60} height={20} />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!course) return (
        <div className="text-center py-24 bg-white rounded-[3rem] shadow-xl">
            <h3 className="text-2xl font-black text-slate-800">Ders bulunamadı.</h3>
            <Button variant="primary" className="mt-6" onClick={() => navigate('/academic')}>Geri Dön</Button>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Breadcrumbs & Header */}
            <div className="space-y-6">
                <button
                    onClick={() => navigate('/academic')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Akademik Yapı'ya Dön
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-black uppercase tracking-widest">{course.grades?.name}</span>
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Müfredat Yönetimi</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{course.name}</h1>
                    </div>
                    <Button
                        variant="primary"
                        size="lg"
                        className="rounded-2xl shadow-xl shadow-primary-500/20 px-8 py-4 gap-2"
                        onClick={() => setIsUnitModalOpen(true)}
                    >
                        <Plus size={20} strokeWidth={3} />
                        Yeni Ünite Ekle
                    </Button>
                </div>
            </div>

            {/* Units & Topics List */}
            <div className="grid gap-8">
                {course.units?.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <Layers size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Henüz ünite tanımlanmamış</p>
                        <button className="mt-4 text-primary-600 font-black hover:underline" onClick={() => setIsUnitModalOpen(true)}>İlk Üniteyi Tanımla</button>
                    </div>
                ) : (
                    course.units?.map((unit: any) => (
                        <div key={unit.id} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-primary-600">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{unit.name}</h3>
                                        <p className="text-xs font-bold text-slate-400">{(unit.topics as any[]).length} Konu Mevcut</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Edit2 size={16} /></button>
                                    <Button variant="outline" size="sm" className="bg-white rounded-xl border-slate-200 text-xs font-black py-2">
                                        YENİ KONU
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {unit.topics?.map((topic: any) => (
                                    <Card key={topic.id} className="p-5 border-slate-100 hover:border-primary-100 hover:bg-primary-50/10 transition-all group rounded-2xl">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                                    <Book size={16} />
                                                </div>
                                                <h4 className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                                    {topic.name}
                                                </h4>
                                            </div>
                                            <div className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md group-hover:bg-primary-500 group-hover:text-white transition-all">
                                                {(topic.learning_outcomes as any[]).length} KAZANIM
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} title="Yeni Ünite Tanımla">
                <div className="space-y-6">
                    <Input
                        label="Ünite Adı"
                        placeholder="Örn: Limit ve Türev"
                        value={newUnitName}
                        onChange={(e) => setNewUnitName(e.target.value)}
                        required
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsUnitModalOpen(false)}>İptal</Button>
                        <Button
                            variant="primary"
                            className="px-8"
                            onClick={() => addUnitMutation.mutate(newUnitName)}
                            isLoading={addUnitMutation.isPending}
                            disabled={!newUnitName.trim()}
                        >
                            Ekle
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
