import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { Card, Button, Skeleton } from '@yedirenklicinar/ui-kit';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Save, Search, BookOpen, Plus, Check, Info, Users, GraduationCap } from 'lucide-react';

export const ExamCreate: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Form State
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('40');
    const [isActive, setIsActive] = useState(true);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
    const [selectedGradeIds, setSelectedGradeIds] = useState<number[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    // Filter State
    const [courseFilter, setCourseFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Courses for filtering
    const { data: courses } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data, error } = await supabase.from('courses').select('*').order('name');
            if (error) throw error;
            return data;
        }
    });

    // Fetch Grades for assignment
    const { data: grades } = useQuery({
        queryKey: ['grades'],
        queryFn: async () => {
            const { data, error } = await supabase.from('grades').select('*').order('name');
            if (error) throw error;
            return data;
        }
    });

    // Fetch Students for assignment
    const { data: students } = useQuery({
        queryKey: ['students-list'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email, grade_id')
                .eq('role', 'student')
                .order('full_name');
            if (error) throw error;
            return data;
        }
    });

    // Fetch Questions based on filters
    const { data: questions, isLoading: isLoadingQuestions } = useQuery({
        queryKey: ['questions-pool', courseFilter, searchTerm],
        queryFn: async () => {
            let query = supabase
                .from('questions')
                .select(`
                    *,
                    learning_outcomes (
                        description,
                        topics (
                            name,
                            units (
                                name,
                                courses (id, name)
                            )
                        )
                    )
                `);

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            let filtered = data;
            if (courseFilter) {
                filtered = data.filter((q: any) =>
                    q.learning_outcomes?.topics?.units?.courses?.id === parseInt(courseFilter)
                );
            }
            if (searchTerm) {
                filtered = filtered.filter((q: any) =>
                    q.content.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            return filtered;
        }
    });

    // Save Mutation
    const saveMutation = useMutation({
        mutationFn: async () => {
            if (!title) throw new Error('Sınav başlığı boş olamaz.');
            if (selectedQuestionIds.length === 0) throw new Error('En az bir soru seçmelisiniz.');
            if (selectedGradeIds.length === 0 && selectedStudentIds.length === 0) {
                throw new Error('En az bir sınıf veya öğrenci seçmelisiniz.');
            }

            // 1. Create Test
            const { data: testData, error: testError } = await supabase
                .from('tests')
                .insert({
                    title,
                    duration_minutes: parseInt(duration),
                    is_active: isActive
                })
                .select()
                .single();

            if (testError) throw testError;

            // 2. Create Test-Question relations
            const testQuestions = selectedQuestionIds.map(qId => ({
                test_id: testData.id,
                question_id: qId
            }));

            const { error: tqError } = await supabase
                .from('test_questions')
                .insert(testQuestions);

            if (tqError) throw tqError;

            // 3. Create Test Assignments
            const assignments: any[] = [];

            selectedGradeIds.forEach(gId => {
                assignments.push({
                    test_id: testData.id,
                    grade_id: gId,
                    student_id: null
                });
            });

            selectedStudentIds.forEach(sId => {
                assignments.push({
                    test_id: testData.id,
                    grade_id: null,
                    student_id: sId
                });
            });

            if (assignments.length > 0) {
                const { error: asError } = await supabase
                    .from('test_assignments')
                    .insert(assignments);
                if (asError) throw asError;
            }

            return testData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            toast.success('Yeni sınav başarıyla oluşturuldu ve atandı.');
            navigate('/exams');
        },
        onError: (err: any) => {
            toast.error('Hata: ' + err.message);
        }
    });

    const toggleQuestion = (id: number) => {
        setSelectedQuestionIds(prev =>
            prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
        );
    };

    const toggleGrade = (id: number) => {
        setSelectedGradeIds(prev =>
            prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
        );
    };

    const toggleStudent = (id: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/exams')}
                        className="w-14 h-14 bg-white border border-slate-200 rounded-[1.25rem] flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:shadow-lg transition-all"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Yeni Sınav Oluştur</h1>
                        <p className="text-slate-500 font-bold tracking-tight">Özelleştirilmiş bir sınav hazırlayın ve atayın.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/exams')}
                        className="flex-1 md:flex-none rounded-2xl px-6 py-4 font-bold text-slate-600"
                    >
                        İptal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => saveMutation.mutate()}
                        isLoading={saveMutation.isPending}
                        className="flex-1 md:flex-none rounded-2xl px-10 py-4 font-black shadow-xl shadow-primary-500/25 flex items-center gap-2 text-white"
                    >
                        <Save size={20} />
                        Sınavı Kaydet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info \u0026 Assignment Section */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Basic Info Card */}
                    <Card className="p-8 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2.5rem] space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Info size={20} className="text-primary-500" /> Sınav Bilgileri
                            </h3>
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Sınav Başlığı</label>
                                    <input
                                        type="text"
                                        placeholder="Örn: 1. Dönem 1. Yazılı"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 focus:ring-0 transition-all outline-none font-bold placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Süre (Dakika)</label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 transition-all outline-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Durum</label>
                                        <div
                                            onClick={() => setIsActive(!isActive)}
                                            className={`w-full py-4 rounded-2xl border-2 font-black text-center text-xs cursor-pointer transition-all ${isActive
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                : 'bg-slate-50 border-slate-100 text-slate-400'
                                                }`}
                                        >
                                            {isActive ? 'AKTİF' : 'TASLAK'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Assignment Card */}
                    <Card className="p-8 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2.5rem] space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Plus size={20} className="text-primary-500" /> Sınav Atama
                            </h3>

                            {/* Grades Section */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                                    <GraduationCap size={14} /> Sınıflara Ata
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {grades?.map(grade => {
                                        const isSelected = selectedGradeIds.includes(grade.id);
                                        return (
                                            <button
                                                key={grade.id}
                                                onClick={() => toggleGrade(grade.id)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${isSelected
                                                    ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                                                    : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                                                    }`}
                                            >
                                                {grade.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Students Section */}
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                                    <Users size={14} /> Özel Öğrenci Seçimi
                                </label>
                                <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {students?.map(student => {
                                        const isSelected = selectedStudentIds.includes(student.id);
                                        const gradeName = grades?.find(g => g.id === student.grade_id)?.name;
                                        return (
                                            <div
                                                key={student.id}
                                                onClick={() => toggleStudent(student.id)}
                                                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border-2 ${isSelected
                                                    ? 'bg-primary-50 border-primary-100 shadow-sm'
                                                    : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                        {isSelected ? <Check size={16} strokeWidth={4} /> : <Users size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-black tracking-tight ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>{student.full_name}</p>
                                                        {gradeName && <p className="text-[9px] font-bold text-slate-400 uppercase">{gradeName}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Summary Section */}
                    <Card className="p-8 border-none shadow-xl shadow-slate-200/40 bg-primary-600 rounded-[2.5rem] text-white space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Toplam Seçim</span>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Check size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-black">{selectedQuestionIds.length}</p>
                                <p className="text-[9px] font-bold uppercase opacity-70">Soru</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">{selectedGradeIds.length}</p>
                                <p className="text-[9px] font-bold uppercase opacity-70">Sınıf</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">{selectedStudentIds.length}</p>
                                <p className="text-[9px] font-bold uppercase opacity-70">Öğrenci</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Question Selector Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Soru havuzunda ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 transition-all outline-none font-bold placeholder:text-slate-300"
                                />
                            </div>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                <select
                                    value={courseFilter}
                                    onChange={(e) => setCourseFilter(e.target.value)}
                                    className="pl-12 pr-10 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500/50 transition-all outline-none font-bold text-slate-600 appearance-none min-w-[200px]"
                                >
                                    <option value="">Tüm Dersler</option>
                                    {courses?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        {isLoadingQuestions ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} className="p-6 border-white bg-white">
                                        <div className="flex items-start gap-4">
                                            <Skeleton width={40} height={40} variant="rectangular" className="rounded-xl" />
                                            <div className="flex-1 space-y-3">
                                                <div className="flex gap-2">
                                                    <Skeleton width={80} height={20} />
                                                    <Skeleton width={60} height={20} />
                                                </div>
                                                <Skeleton variant="text" width="90%" />
                                                <Skeleton variant="text" width="60%" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : questions && questions.length > 0 ? (
                            questions.map((q, i) => {
                                const isSelected = selectedQuestionIds.includes(q.id);
                                return (
                                    <div
                                        key={q.id}
                                        onClick={() => toggleQuestion(q.id)}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                        className={`group cursor-pointer p-6 rounded-[2rem] border-2 transition-all duration-300 animate-in slide-in-from-right-4 ${isSelected
                                            ? 'bg-primary-50/30 border-primary-500/30 shadow-xl shadow-primary-500/5'
                                            : 'bg-white border-white hover:border-slate-200 hover:shadow-lg'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600'
                                                }`}>
                                                {isSelected ? <Check size={20} strokeWidth={4} /> : <Plus size={20} strokeWidth={3} />}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 px-3 py-1 bg-primary-100/50 rounded-lg">
                                                        {q.learning_outcomes?.topics?.units?.courses?.name || 'Ders Belirtilmemiş'}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-1 rounded-lg">
                                                        Zorluk: {q.difficulty_level || 1}
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 font-bold leading-relaxed line-clamp-3 text-lg">
                                                    {q.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                <Search size={48} className="mx-auto text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold text-slate-300">Uygun Soru Bulunamadı</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
