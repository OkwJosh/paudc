import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, type Course, type Enrollment } from '@/lib/api';
import LMSSidebar from '@/components/lms/LMSSidebar';

const DIFFICULTY_COLORS: Record<string, string> = {
    beginner: '#1B5E3B',
    intermediate: '#C8A046',
    advanced: '#A4372C',
};

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

export default function LMSCourses() {
    const { user, loading } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [dataLoading, setDataLoading] = useState(true);
    const [enrolling, setEnrolling] = useState<number | null>(null);

    useEffect(() => {
        if (!loading && !user) window.location.href = '/login';
    }, [user, loading]);

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const [cr, er] = await Promise.all([
                    api.entities.courses.query({ limit: 50 }),
                    api.entities.enrollments.query({ limit: 50 }),
                ]);
                setCourses(cr.data.items);
                setEnrollments(er.data.items);
            } finally {
                setDataLoading(false);
            }
        })();
    }, [user]);

    const enrolledIds = new Set(enrollments.map(e => e.course_id));

    const handleEnroll = async (courseId: number) => {
        setEnrolling(courseId);
        try {
            const res = await api.entities.enrollments.create({ course_id: courseId, status: 'enrolled' });
            setEnrollments(prev => [...prev, res.data]);
        } finally {
            setEnrolling(null);
        }
    };

    const filtered = courses.filter(c => {
        const matchesSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            (c.description || '').toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === 'all' || c.difficulty_level?.toLowerCase() === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6F0E1]">
                <div className="w-10 h-10 rounded-full border-4 border-[#1B5E3B] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F6F0E1]">
            <LMSSidebar />

            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-20 bg-[#F6F0E1]/95 backdrop-blur-sm border-b border-[#022512]/10 px-6 md:px-8 py-4 mt-[52px] md:mt-0">
                    <h1 className="text-lg font-black text-[#022512]">Course Catalogue</h1>
                    <p className="text-xs text-[#022512]/55 mt-0.5">Browse and enroll in available courses</p>
                </header>

                <div className="px-6 md:px-8 py-7 max-w-6xl">

                    {/* Search + Filter bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-7">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#022512]/35" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search courses…"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#022512]/15 bg-white text-sm text-[#022512] placeholder-[#022512]/35 focus:outline-none focus:ring-2 focus:ring-[#1B5E3B]/30"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {DIFFICULTIES.map(d => (
                                <button
                                    key={d}
                                    onClick={() => setFilter(d)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter === d
                                            ? 'bg-[#022512] text-[#F6F0E1]'
                                            : 'bg-white border border-[#022512]/15 text-[#022512]/65 hover:border-[#022512]/30'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {dataLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl h-56 animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <BookOpen className="w-12 h-12 text-[#022512]/15 mx-auto mb-4" />
                            <p className="font-bold text-sm text-[#022512]/60">No courses found</p>
                            <p className="text-xs text-[#022512]/40 mt-1">Try a different search or filter</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map(course => {
                                const enrolled = enrolledIds.has(course.id);
                                const diff = course.difficulty_level?.toLowerCase() || 'beginner';
                                const diffColor = DIFFICULTY_COLORS[diff] || '#1B5E3B';
                                return (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-2xl shadow-sm border border-[#022512]/5 overflow-hidden flex flex-col"
                                    >
                                        {/* Thumbnail */}
                                        <div className="h-32 bg-[#022512]/5 flex items-center justify-center overflow-hidden">
                                            {course.thumbnail_url ? (
                                                <img
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <BookOpen className="w-9 h-9 text-[#022512]/12" />
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col flex-1 gap-3">
                                            <div>
                                                <span
                                                    className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                                                    style={{ background: `${diffColor}18`, color: diffColor }}
                                                >
                                                    {diff}
                                                </span>
                                                <h3 className="mt-2 font-bold text-[#022512] text-sm leading-snug line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                {course.description && (
                                                    <p className="mt-1 text-xs text-[#022512]/50 line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                )}
                                            </div>

                                            {course.estimated_hours && (
                                                <div className="flex items-center gap-1.5 text-xs text-[#022512]/45">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {course.estimated_hours}h estimated
                                                </div>
                                            )}

                                            <div className="mt-auto flex gap-2">
                                                {enrolled ? (
                                                    <Link
                                                        to={`/lms/courses/${course.id}`}
                                                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#1B5E3B] text-[#F6F0E1] text-xs font-bold py-2.5 rounded-xl hover:bg-[#0d301e] transition-colors"
                                                    >
                                                        Continue <ChevronRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEnroll(course.id)}
                                                            disabled={enrolling === course.id}
                                                            className="flex-1 bg-[#C8A046] hover:bg-[#b08c3e] disabled:opacity-60 text-[#022512] text-xs font-bold py-2.5 rounded-xl transition-colors"
                                                        >
                                                            {enrolling === course.id ? 'Enrolling…' : 'Enroll Now'}
                                                        </button>
                                                        <Link
                                                            to={`/lms/courses/${course.id}`}
                                                            className="flex items-center justify-center px-3 border border-[#022512]/12 rounded-xl hover:bg-[#022512]/5 transition-colors"
                                                        >
                                                            <ChevronRight className="w-4 h-4 text-[#022512]/50" />
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
