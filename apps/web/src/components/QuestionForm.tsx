import React, { useState } from 'react';
import { Button, Select, Textarea } from '@yedirenklicinar/ui-kit';
import { supabase } from '@yedirenklicinar/shared-api';
import { Plus, Trash2, CheckCircle2, Layout, FileText, CheckSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Option {
    option_text: string;
    is_correct: boolean;
}

interface QuestionFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: any;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSuccess, onCancel, initialData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form and Hierarchy State
    const [selectedGrade, setSelectedGrade] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [selectedOutcome, setSelectedOutcome] = useState<string>('');

    const [content, setContent] = useState('');
    const [difficulty, setDifficulty] = useState('1');
    const [options, setOptions] = useState<Option[]>([
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
    ]);

    // Populate form if editing
    React.useEffect(() => {
        if (initialData) {
            const q = initialData;
            setContent(q.content || '');
            setDifficulty(String(q.difficulty_level || '1'));

            if (q.options) {
                setOptions(q.options.map((o: any) => ({
                    option_text: o.option_text,
                    is_correct: o.is_correct
                })));
            }

            // Hierarchy setup
            const outcome = q.learning_outcomes;
            if (outcome) {
                setSelectedOutcome(String(outcome.id));
                const topic = outcome.topics;
                if (topic) {
                    setSelectedTopic(String(topic.id));
                    const unit = topic.units;
                    if (unit) {
                        setSelectedUnit(String(unit.id));
                        const course = unit.courses;
                        if (course) {
                            setSelectedCourse(String(course.id));
                            setSelectedGrade(String(course.grade_id));
                        }
                    }
                }
            }
        }
    }, [initialData]);

    // Data Fetching
    const { data: grades } = useQuery({
        queryKey: ['grades'], queryFn: async () => {
            const { data } = await supabase.from('grades').select('*').order('name');
            return data || [];
        }
    });

    const { data: courses } = useQuery({
        queryKey: ['courses', selectedGrade], queryFn: async () => {
            if (!selectedGrade) return [];
            const { data } = await supabase.from('courses').select('*').eq('grade_id', selectedGrade).order('name');
            return data || [];
        }, enabled: !!selectedGrade
    });

    const { data: units } = useQuery({
        queryKey: ['units', selectedCourse], queryFn: async () => {
            if (!selectedCourse) return [];
            const { data } = await supabase.from('units').select('*').eq('course_id', selectedCourse).order('name');
            return data || [];
        }, enabled: !!selectedCourse
    });

    const { data: topics } = useQuery({
        queryKey: ['topics', selectedUnit], queryFn: async () => {
            if (!selectedUnit) return [];
            const { data } = await supabase.from('topics').select('*').eq('unit_id', selectedUnit).order('name');
            return data || [];
        }, enabled: !!selectedUnit
    });

    const { data: outcomes } = useQuery({
        queryKey: ['outcomes', selectedTopic], queryFn: async () => {
            if (!selectedTopic) return [];
            const { data } = await supabase.from('learning_outcomes').select('*').eq('topic_id', selectedTopic).order('code');
            return data || [];
        }, enabled: !!selectedTopic
    });

    const handleAddOption = () => {
        setOptions([...options, { option_text: '', is_correct: false }]);
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index: number, text: string) => {
        const newOptions = [...options];
        newOptions[index].option_text = text;
        setOptions(newOptions);
    };

    const handleToggleCorrect = (index: number) => {
        const newOptions = options.map((opt, i) => ({
            ...opt,
            is_correct: i === index
        }));
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOutcome || !content) {
            toast.error('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        const correctOption = options.find(o => o.is_correct);
        if (!correctOption) {
            toast.error('Lütfen doğru bir seçenek belirleyin.');
            return;
        }

        setIsSubmitting(true);
        try {
            let questionId = initialData?.id;

            if (questionId) {
                // Update existing question
                const { error: qError } = await supabase
                    .from('questions')
                    .update({
                        learning_outcome_id: parseInt(selectedOutcome),
                        content,
                        difficulty_level: parseInt(difficulty)
                    })
                    .eq('id', questionId);

                if (qError) throw qError;

                // Delete old options and insert new ones
                const { error: dOError } = await supabase.from('options').delete().eq('question_id', questionId);
                if (dOError) throw dOError;
            } else {
                // Insert new question
                const { data: questionData, error: qError } = await supabase
                    .from('questions')
                    .insert({
                        learning_outcome_id: parseInt(selectedOutcome),
                        content,
                        difficulty_level: parseInt(difficulty)
                    })
                    .select()
                    .single();

                if (qError) throw qError;
                questionId = questionData.id;
            }

            const optionsToInsert = options.filter(o => o.option_text.trim()).map(o => ({
                question_id: questionId,
                option_text: o.option_text,
                is_correct: o.is_correct
            }));

            const { error: oError } = await supabase.from('options').insert(optionsToInsert);
            if (oError) throw oError;

            toast.success(initialData ? 'Soru başarıyla güncellendi.' : 'Yeni soru başarıyla eklendi.');
            onSuccess();
        } catch (error: any) {
            console.error('Error saving question:', error);
            toast.error('Soru kaydedilirken bir hata oluştu: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 pb-12">
            {/* Section 1: Müfredat Bilgileri */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Layout size={20} className="text-primary-600" />
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Müfredat Bilgileri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <Select
                        label="Sınıf"
                        value={selectedGrade}
                        onChange={(e) => { setSelectedGrade(e.target.value); setSelectedCourse(''); }}
                        options={[{ value: '', label: 'Sınıf Seçin' }, ...(grades?.map(g => ({ value: g.id, label: g.name })) || [])]}
                    />
                    <Select
                        label="Ders"
                        value={selectedCourse}
                        onChange={(e) => { setSelectedCourse(e.target.value); setSelectedUnit(''); }}
                        disabled={!selectedGrade}
                        options={[{ value: '', label: 'Ders Seçin' }, ...(courses?.map(c => ({ value: c.id, label: c.name })) || [])]}
                    />
                    <Select
                        label="Ünite"
                        value={selectedUnit}
                        onChange={(e) => { setSelectedUnit(e.target.value); setSelectedTopic(''); }}
                        disabled={!selectedCourse}
                        options={[{ value: '', label: 'Ünite Seçin' }, ...(units?.map(u => ({ value: u.id, label: u.name })) || [])]}
                    />
                    <Select
                        label="Konu"
                        value={selectedTopic}
                        onChange={(e) => { setSelectedTopic(e.target.value); setSelectedOutcome(''); }}
                        disabled={!selectedUnit}
                        options={[{ value: '', label: 'Konu Seçin' }, ...(topics?.map(t => ({ value: t.id, label: t.name })) || [])]}
                    />
                    <div className="md:col-span-2">
                        <Select
                            label="Kazanım"
                            value={selectedOutcome}
                            onChange={(e) => setSelectedOutcome(e.target.value)}
                            disabled={!selectedTopic}
                            options={[{ value: '', label: 'Kazanım Seçin' }, ...(outcomes?.map(o => ({ value: o.id, label: `${o.code} - ${o.description}` })) || [])]}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Soru İçeriği */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <FileText size={20} className="text-primary-600" />
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Soru Metni & Zorluk</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Textarea
                            label="Soru İçeriği"
                            placeholder="Soru metnini buraya yazın..."
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <Select
                        label="Zorluk Seviyesi"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        options={[
                            { value: '1', label: 'Çok Kolay' },
                            { value: '2', label: 'Kolay' },
                            { value: '3', label: 'Orta' },
                            { value: '4', label: 'Zor' },
                            { value: '5', label: 'Çok Zor' },
                        ]}
                    />
                </div>
            </div>

            {/* Section 3: Seçenekler */}
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <CheckSquare size={20} className="text-primary-600" />
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Seçenekler</h3>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="gap-2 rounded-xl text-xs font-black h-9 border-slate-200">
                        <Plus size={14} strokeWidth={3} /> SEÇENEK EKLE
                    </Button>
                </div>

                <div className="grid gap-3">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                            <button
                                type="button"
                                onClick={() => handleToggleCorrect(index)}
                                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${option.is_correct
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                    : 'bg-white border border-slate-200 text-slate-300 hover:text-slate-400 group-hover:border-slate-300'
                                    }`}
                            >
                                <CheckCircle2 size={24} />
                            </button>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder={`${String.fromCharCode(65 + index)} Seçeneği Metni...`}
                                    value={option.option_text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-8 mt-10 border-t border-slate-100">
                <Button type="button" variant="ghost" className="px-8 font-bold text-slate-500" onClick={onCancel}>İptal</Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="px-12 py-6 rounded-2xl shadow-xl shadow-primary-500/25 font-black text-lg">
                    Soruyu Kaydet ve Yayınla
                </Button>
            </div>
        </form>
    );
};
