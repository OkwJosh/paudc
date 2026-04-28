import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, CheckCircle2, PlayCircle,
    Lock, BookOpen, ChevronDown, ChevronUp, FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, type Course, type Enrollment } from '@/lib/api';
import LMSSidebar from '@/components/lms/LMSSidebar';

interface Module {
    id: number;
    title: string;
    type: 'video' | 'text' | 'quiz';
    duration?: string;
    videoUrl?: string;
    content?: string;
}

/* Placeholder module content — replaced by real API data when available */
const buildModules = (courseTitle: string): Module[] => [
    {
        id: 1,
        title: 'Introduction & Overview',
        type: 'video',
        duration: '8 min',
        videoUrl: '',
        content: `<h2>Welcome to ${courseTitle}</h2><p>This module introduces you to the core ideas and expectations of the course. By the end of this section, you will have a solid foundation to engage with the remaining modules.</p><p>PAUDC 2026 brings together the brightest minds from across the African continent. This course is designed to equip you with the tools you need to compete at the highest level.</p>`,
    },
    {
        id: 2,
        title: 'Core Concepts',
        type: 'text',
        duration: '15 min read',
        content: `<h2>Core Concepts</h2><p>Understanding the foundational principles is essential before moving on to advanced techniques. In this module, we examine the building blocks of effective argumentation.</p><h3>The Anatomy of an Argument</h3><p>Every strong argument has three components: a <strong>claim</strong>, <strong>evidence</strong>, and a <strong>warrant</strong> linking the two. Mastering this structure is the single highest-leverage skill in competitive debate.</p><ul><li>Claim — the assertion you are making</li><li>Evidence — facts, data, expert testimony that support it</li><li>Warrant — the logical link explaining why the evidence proves the claim</li></ul><blockquote>"The goal of debate is not to win at any cost, but to arrive at truth through rigorous dialogue."</blockquote>`,
    },
    {
        id: 3,
        title: 'Practical Application',
        type: 'video',
        duration: '20 min',
        videoUrl: '',
        content: `<h2>Practical Application</h2><p>In this session, we walk through worked examples drawn from past PAUDC motions. You will see how theoretical principles translate into live debate performance.</p><p>Pay close attention to how experienced debaters structure their rebuttals and handle Points of Information (POIs) under pressure.</p>`,
    },
    {
        id: 4,
        title: 'Advanced Techniques',
        type: 'text',
        duration: '12 min read',
        content: `<h2>Advanced Techniques</h2><p>Once you have the basics down, these higher-order skills will distinguish you from the competition.</p><h3>Comparative Analysis</h3><p>Rather than simply refuting your opponent's points, show why your world is <strong>comparatively better</strong>. Judges look for debaters who can weigh competing claims, not just attack one side of the debate.</p><h3>Framing</h3><p>Controlling the framing of the debate — the lens through which the motion is evaluated — is often more important than the individual arguments you make. Introduce your framing early and defend it consistently.</p>`,
    },
    {
        id: 5,
        title: 'Assessment & Review',
        type: 'quiz',
        duration: '10 min',
        content: `<h2>Assessment & Review</h2><p>This final module consolidates your learning through a series of reflective exercises. Complete the self-assessment checklist before moving on.</p><ul><li>Can you identify the claim, evidence, and warrant in any argument?</li><li>Can you construct a two-minute speech on an unfamiliar motion in under five minutes of preparation?</li><li>Can you respond to a Point of Information without losing the thread of your argument?</li></ul><p>If you answered yes to all three, you are ready for the next course!</p>`,
    },
];

export default function LMSModuleViewer() {
    const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [marked, setMarked] = useState(false);

    const modules = course ? buildModules(course.title) : buildModules('Course');
    const currentIdx = Math.max(
        0,
        modules.findIndex(m => m.id === Number(moduleId ?? '1')),
    );
    const current = modules[currentIdx];
    const prev = modules[currentIdx - 1] ?? null;
    const next = modules[currentIdx + 1] ?? null;

    const completedCount = enrollment
        ? Math.round(((enrollment.progress_percentage ?? 0) / 100) * modules.length)
        : 0;

    useEffect(() => {
        if (!loading && !user) window.location.href = '/login';
    }, [user, loading]);

    useEffect(() => {
        if (!user || !courseId) return;
        (async () => {
            try {
                const [cr, er] = await Promise.all([
                    api.entities.courses.query({ limit: 200 }),
                    api.entities.enrollments.query({ limit: 200 }),
                ]);
                setCourse(cr.data.items.find(c => c.id === Number(courseId)) ?? null);
                setEnrollment(er.data.items.find(e => e.course_id === Number(courseId)) ?? null);
            } finally {
                setDataLoading(false);
            }
        })();
    }, [user, courseId]);

    const handleMarkComplete = async () => {
        if (!enrollment || !course) return;
        const newProgress = Math.min(100, Math.round(((currentIdx + 1) / modules.length) * 100));
        try {
            await api.entities.enrollments.update(enrollment.id, {
                progress_percentage: newProgress,
                status: newProgress === 100 ? 'completed' : 'in_progress',
            });
            setMarked(true);
            if (next) {
                navigate(`/lms/courses/${courseId}/modules/${next.id}`);
            }
        } catch {
            setMarked(true);
        }
    };

    if (loading || dataLoading) {
        return (
            <div className="flex min-h-screen bg-[#F6F0E1]">
                <LMSSidebar />
                <div className="flex-1 flex items-center justify-center mt-[52px] md:mt-0">
                    <div className="w-10 h-10 rounded-full border-4 border-[#1B5E3B] border-t-transparent animate-spin" />
                </div>
            </div>
        );
    }

    const isDone = (idx: number) => idx < completedCount;

    return (
        <div className="flex min-h-screen bg-[#F6F0E1]">
            <LMSSidebar />

            <div className="flex-1 flex flex-col overflow-hidden mt-[52px] md:mt-0">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-[#F6F0E1]/95 backdrop-blur-sm border-b border-[#022512]/10 px-4 md:px-6 py-3 flex items-center gap-3">
                    <Link
                        to={`/lms/courses/${courseId}`}
                        className="p-2 rounded-xl hover:bg-[#022512]/6 transition-colors shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#022512]" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#022512]/50 truncate">{course?.title}</p>
                        <h1 className="text-sm font-black text-[#022512] truncate">{current.title}</h1>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#022512]/55 hover:text-[#022512] transition-colors"
                    >
                        {sidebarOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        Modules
                    </button>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Main content area */}
                    <main className="flex-1 overflow-y-auto">
                        {/* Content viewer */}
                        <div className="max-w-4xl mx-auto px-4 md:px-8 py-7">

                            {/* Video area (shown for video-type modules) */}
                            {current.type === 'video' && (
                                <div className="bg-[#022512] rounded-2xl overflow-hidden mb-7 aspect-video flex items-center justify-center">
                                    {current.videoUrl ? (
                                        <iframe
                                            src={current.videoUrl}
                                            className="w-full h-full"
                                            allow="autoplay; fullscreen"
                                            title={current.title}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-[#F6F0E1]/50">
                                            <PlayCircle className="w-16 h-16" />
                                            <p className="text-sm font-semibold">Video content coming soon</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Module type badge + duration */}
                            <div className="flex items-center gap-3 mb-5">
                                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${current.type === 'video'
                                        ? 'bg-[#1B5E3B]/12 text-[#1B5E3B]'
                                        : current.type === 'quiz'
                                            ? 'bg-[#A4372C]/12 text-[#A4372C]'
                                            : 'bg-[#C8A046]/12 text-[#C8A046]'
                                    }`}>
                                    {current.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                    {current.type}
                                </span>
                                {current.duration && (
                                    <span className="text-xs text-[#022512]/45">{current.duration}</span>
                                )}
                            </div>

                            {/* Prose content */}
                            {current.content && (
                                <div
                                    className="prose-paudc bg-white rounded-2xl p-6 md:p-8 border border-[#022512]/5"
                                    dangerouslySetInnerHTML={{ __html: current.content }}
                                />
                            )}

                            {/* Navigation + completion controls */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 mt-7">
                                {prev ? (
                                    <Link
                                        to={`/lms/courses/${courseId}/modules/${prev.id}`}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 border border-[#022512]/15 rounded-xl text-sm font-semibold text-[#022512] hover:bg-[#022512]/5 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Previous
                                    </Link>
                                ) : <div className="flex-1 sm:flex-none" />}

                                {!isDone(currentIdx) ? (
                                    <button
                                        onClick={handleMarkComplete}
                                        disabled={marked}
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#1B5E3B] hover:bg-[#0d301e] disabled:opacity-60 text-[#F6F0E1] font-bold py-3 px-6 rounded-xl text-sm transition-colors"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {marked ? 'Marked complete!' : 'Mark as Complete'}
                                    </button>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center gap-2 bg-[#1B5E3B]/12 text-[#1B5E3B] font-bold py-3 px-6 rounded-xl text-sm">
                                        <CheckCircle2 className="w-4 h-4" /> Completed
                                    </div>
                                )}

                                {next ? (
                                    <Link
                                        to={`/lms/courses/${courseId}/modules/${next.id}`}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#C8A046] hover:bg-[#b08c3e] rounded-xl text-sm font-bold text-[#022512] transition-colors"
                                    >
                                        Next <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/lms/courses/${courseId}`}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-[#022512] rounded-xl text-sm font-bold text-[#F6F0E1] hover:bg-[#011508] transition-colors"
                                    >
                                        Finish Course <CheckCircle2 className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* Collapsible module list sidebar (desktop) */}
                    {sidebarOpen && (
                        <aside className="hidden md:flex flex-col w-72 border-l border-[#022512]/10 bg-white overflow-y-auto">
                            <div className="px-4 py-4 border-b border-[#022512]/8">
                                <p className="text-xs font-black text-[#022512] uppercase tracking-wider">Course Modules</p>
                            </div>
                            <nav className="p-3 space-y-1">
                                {modules.map((mod, idx) => {
                                    const done = isDone(idx);
                                    const active = mod.id === current.id;
                                    const locked = !enrollment && idx > 0;
                                    return (
                                        <Link
                                            key={mod.id}
                                            to={locked ? '#' : `/lms/courses/${courseId}/modules/${mod.id}`}
                                            onClick={e => locked && e.preventDefault()}
                                            className={`flex items-start gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${active
                                                    ? 'bg-[#022512] text-[#F6F0E1]'
                                                    : done
                                                        ? 'text-[#1B5E3B] hover:bg-[#1B5E3B]/8'
                                                        : locked
                                                            ? 'text-[#022512]/25 cursor-not-allowed'
                                                            : 'text-[#022512]/65 hover:bg-[#022512]/5'
                                                }`}
                                        >
                                            <span className="shrink-0 mt-0.5">
                                                {done ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                ) : active ? (
                                                    <PlayCircle className="w-3.5 h-3.5" />
                                                ) : locked ? (
                                                    <Lock className="w-3.5 h-3.5" />
                                                ) : (
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                )}
                                            </span>
                                            <span className="leading-snug">{idx + 1}. {mod.title}</span>
                                            {mod.duration && (
                                                <span className={`ml-auto shrink-0 text-[10px] ${active ? 'text-[#F6F0E1]/60' : 'text-[#022512]/35'}`}>
                                                    {mod.duration}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
