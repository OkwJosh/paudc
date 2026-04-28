import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { BLOG_POSTS, CATEGORIES, getPostsByCategory, formatDate, getCategoryImage } from '@/data/blogPosts';

const CATEGORY_COLORS: Record<string, string> = {
    'Debate Tips': '#1B5E3B',
    'Championship News': '#C8A046',
    'Civic Engagement': '#A4372C',
    'Preparation': '#022512',
};

export default function BlogIndex() {
    const [activeCategory, setActiveCategory] = useState('All');
    const posts = getPostsByCategory(activeCategory);
    const featured = BLOG_POSTS.find(p => p.featured);
    const remaining = posts.filter(p => !p.featured || activeCategory !== 'All');

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Blog"
                description="Debate tips, championship news, civic engagement insights, and preparation guides from the PAUDC 2026 team."
                canonical="https://www.paudc2026.com/blog"
            />
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#022512] to-[#1B5E3B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-20">
                    <p className="text-[#C8A046] font-semibold text-sm tracking-widest uppercase mb-3">
                        PAUDC 2026
                    </p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#F6F0E1] leading-tight max-w-2xl">
                        Ideas Worth Arguing
                    </h1>
                    <p className="mt-4 text-lg text-[#F6F0E1]/75 max-w-xl">
                        Debate strategy, championship updates, civic thinking, and preparation guides — written by the people building PAUDC 2026.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-20 py-12">

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat
                                    ? 'bg-[#022512] text-[#F6F0E1]'
                                    : 'bg-[#F6F0E1] border border-[#022512]/15 text-[#022512]/65 hover:border-[#022512]/40 hover:text-[#022512]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured post (shown only on "All" tab) */}
                {activeCategory === 'All' && featured && (
                    <Link
                        to={`/blog/${featured.slug}`}
                        className="group block mb-12 bg-[#F6F0E1] rounded-3xl overflow-hidden border border-[#022512]/8 hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="grid md:grid-cols-2">
                            {/* Thumbnail */}
                            <div className="h-56 md:h-auto bg-[#022512] relative overflow-hidden">
                                <img
                                    src={featured.thumbnail || getCategoryImage(featured.category)}
                                    alt={featured.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#022512]/40 via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#C8A046]">
                                        Featured
                                    </span>
                                    <span className="text-xs text-[#022512]/40">•</span>
                                    <span
                                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                        style={{
                                            background: `${CATEGORY_COLORS[featured.category] || '#022512'}18`,
                                            color: CATEGORY_COLORS[featured.category] || '#022512',
                                        }}
                                    >
                                        {featured.category}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-[#022512] leading-snug mb-3 group-hover:text-[#1B5E3B] transition-colors">
                                    {featured.title}
                                </h2>
                                <p className="text-sm text-[#022512]/65 leading-relaxed mb-5 line-clamp-3">
                                    {featured.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-[#022512]/45">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(featured.date)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {featured.readTime} min read
                                    </span>
                                </div>
                                <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-[#1B5E3B] group-hover:gap-3 transition-all">
                                    Read article <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Post grid */}
                {remaining.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-[#022512]/40 font-semibold">No posts in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {remaining.map(post => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group bg-[#F6F0E1] rounded-2xl overflow-hidden border border-[#022512]/8 hover:-translate-y-1 transition-transform duration-300 flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="h-44 bg-[#022512] relative overflow-hidden shrink-0">
                                    <img
                                        src={post.thumbnail || getCategoryImage(post.category)}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                            style={{
                                                background: `${CATEGORY_COLORS[post.category] || '#022512'}18`,
                                                color: CATEGORY_COLORS[post.category] || '#022512',
                                            }}
                                        >
                                            {post.category}
                                        </span>
                                    </div>

                                    <h3 className="font-extrabold text-[#022512] text-base leading-snug line-clamp-2 group-hover:text-[#1B5E3B] transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-[#022512]/60 leading-relaxed line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between text-[10px] text-[#022512]/40 pt-2 border-t border-[#022512]/8">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(post.date)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime} min
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {post.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="flex items-center gap-1 text-[10px] font-medium text-[#022512]/45 bg-[#022512]/6 px-2 py-0.5 rounded-full"
                                            >
                                                <Tag className="w-2.5 h-2.5" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
