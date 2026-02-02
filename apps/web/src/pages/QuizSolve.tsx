import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@yedirenklicinar/shared-api';
import { Card, Button } from '@yedirenklicinar/ui-kit';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const QuizSolve: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    // Fetch Test Data
    const { data: testData, isLoading } = useQuery({
        queryKey: ['test-solve', id],
        queryFn: async () => {
            const { data: test, error } = await supabase
                .from('tests')
                .select(`
                    *,
                    test_questions (
                        question_id,
                        questions (
                            *,
                            options (*)
                        )
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return test;
        }
    });

    const questions = testData?.test_questions?.map((tq: any) => tq.questions) || [];

    // Timer Logic
    useEffect(() => {
        if (testData?.duration_minutes && timeLeft === null) {
            setTimeLeft(testData.duration_minutes * 60);
        }

        if (timeLeft === 0) {
            handleAutoSubmit();
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
        }, 1000);

        return () => clearInterval(timer);
    }, [testData, timeLeft]);

    // Submission Mutation
    const submitMutation = useMutation({
        mutationFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum kapalı');

            // Calculate Score
            let correctCount = 0;
            questions.forEach((q: any) => {
                const selectedOptionId = selectedOptions[q.id];
                const correctOption = q.options.find((o: any) => o.is_correct);
                if (selectedOptionId === correctOption?.id) {
                    correctCount++;
                }
            });

            const score = Math.round((correctCount / questions.length) * 100);

            // Save Submission
            const { error } = await supabase
                .from('submissions')
                .insert({
                    student_id: user.id,
                    test_id: parseInt(id!),
                    score,
                    answers: selectedOptions,
                    completed_at: new Date().toISOString()
                });

            if (error) throw error;
            return score;
        },
        onSuccess: () => {
            setIsFinished(true);
        }
    });

    const handleAutoSubmit = () => {
        if (!isFinished && !submitMutation.isPending) {
            submitMutation.mutate();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
                <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-bold">Sinav hazirlaniyor...</p>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <Card className="max-w-xl w-full p-12 text-center space-y-8 rounded-[3rem] shadow-2xl border-none animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                        <ShieldCheck size={48} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">Sınav Tamamlandı!</h2>
                        <p className="text-slate-500 font-bold text-lg">Cevapların başarıyla kaydedildi ve analiz ediliyor.</p>
                    </div>
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border-2 border-slate-100 space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tahmini Başarı Oranın</p>
                        <p className="text-7xl font-black text-primary-600 tracking-tighter italic">%{submitMutation.data}</p>
                    </div>
                    <Button
                        variant="primary"
                        className="w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/30 text-white"
                        onClick={() => navigate('/student/exams')}
                    >
                        Panelli Görüntüle
                    </Button>
                </Card>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100">
            {/* Focused Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { if (window.confirm('Sinavi terketmek istediginize emin misiniz? Ilerlemeniz kaydedilmeyecek.')) navigate('/student/exams') }}
                            className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div className="h-6 w-[2px] bg-slate-100 mx-1"></div>
                        <div>
                            <h1 className="text-base font-black text-slate-800 tracking-tight truncate max-w-[150px] md:max-w-md uppercase italic">
                                {testData?.title}
                            </h1>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="text-primary-500">Kazanım Odaklı</span> • <span>Soru {currentQuestionIndex + 1}/{questions.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-black text-base shadow-sm transition-all duration-300 ${timeLeft && timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                        <Clock size={18} className={timeLeft && timeLeft < 60 ? 'text-red-500' : 'text-primary-500'} />
                        {timeLeft !== null && formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-8 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column: Progress Paneli */}
                    <div className="hidden lg:block space-y-6 lg:col-span-1">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 italic">Soru Rehberi</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {questions.map((_: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={`h-10 rounded-lg text-xs font-black transition-all border-2 ${currentQuestionIndex === idx
                                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                                            : selectedOptions[questions[idx].id]
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-[1.5rem] border border-amber-100 space-y-2">
                            <div className="flex items-center gap-2 text-amber-700">
                                <AlertTriangle size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Hatırlatma</span>
                            </div>
                            <p className="text-[10px] font-bold text-amber-800 leading-tight">
                                Süre sonunda cevaplar otomatik kaydedilir.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Question & Options */}
                    <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        {currentQuestion && (
                            <>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-500 px-2 py-0.5 bg-primary-100/50 rounded-md">Soru {currentQuestionIndex + 1}</span>
                                        <div className="prose prose-slate max-w-none">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug tracking-tight">
                                                {currentQuestion.content}
                                            </h2>
                                        </div>
                                    </div>

                                    {currentQuestion.image_url && (
                                        <div className="rounded-[1.5rem] overflow-hidden border-2 border-slate-100 shadow-md max-w-xl">
                                            <img src={currentQuestion.image_url} alt="Soru görseli" className="w-full h-auto" />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {currentQuestion.options.map((option: any, oIdx: number) => {
                                            const label = ['A', 'B', 'C', 'D', 'E'][oIdx];
                                            const isSelected = selectedOptions[currentQuestion.id] === option.id;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setSelectedOptions(prev => ({ ...prev, [currentQuestion.id]: option.id }))}
                                                    className={`flex items-center gap-4 p-4 rounded-[1.5rem] border-2 text-left transition-all duration-300 group ${isSelected
                                                        ? 'bg-primary-50 border-primary-500 shadow-lg shadow-primary-500/5'
                                                        : 'bg-white border-slate-50 hover:border-slate-200 hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-base font-black transition-all ${isSelected ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600'
                                                        }`}>
                                                        {label}
                                                    </div>
                                                    <span className={`text-base font-bold leading-tight ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>
                                                        {option.option_text}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 p-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Button
                        variant="ghost"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        className="flex items-center gap-3 px-8 py-4 font-black text-slate-500 hover:text-primary-600 disabled:opacity-30"
                    >
                        <ArrowLeft size={20} />
                        Önceki Soru
                    </Button>

                    <div className="hidden md:flex gap-1">
                        {questions.map((_: any, i: number) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentQuestionIndex ? 'w-8 bg-primary-500' : selectedOptions[questions[i].id] ? 'w-1.5 bg-emerald-400' : 'w-1.5 bg-slate-200'}`}></div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {currentQuestionIndex === questions.length - 1 ? (
                            <Button
                                variant="primary"
                                isLoading={submitMutation.isPending}
                                onClick={() => { if (window.confirm('Sinavi bitirmek istediginize emin misiniz?')) submitMutation.mutate() }}
                                className="flex items-center gap-3 px-12 py-4 bg-emerald-600 hover:bg-emerald-700 font-black shadow-xl shadow-emerald-500/20 rounded-2xl text-white"
                            >
                                <CheckCircle2 size={20} />
                                Sınavı Bitir
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="flex items-center gap-3 px-12 py-4 shadow-xl shadow-primary-500/20 rounded-2xl font-black text-white"
                            >
                                Sonraki Soru
                                <ArrowRight size={20} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
