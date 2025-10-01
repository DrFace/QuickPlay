import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios"; // Add this at the top with other imports
import banner00 from "@/assets/images/banner002.png";
import banner002 from "@/assets/images/banner002.png";

import banner003 from "@/assets/images/banner002.png";

import banner004 from "@/assets/images/banner002.png";

import banner005 from "@/assets/images/banner002.png";

import { ArrowUpIcon } from '@heroicons/react/24/solid';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Helmet } from "react-helmet"; // <-- Added for SEO

// ---- Types ----
type Article = {
    id: string | number;
    title: string;
    excerpt?: string;
    category?: string;
    published_at?: string;
    image?: string | null;
};

type League = {
    id: string | number;
    name: string;
    country?: string;
};

type LiveMatch = {
    id: number;
    league: { data: { name: string; country?: string } };
    scores: { localteam_score: number; visitorteam_score: number };
    participants: { data: { name: string }[] };
    time: string;
};

// ---- Transformer for fixture data ----
function transformFixture(fixture: any): LiveMatch {
    const home = fixture.participants.find((p: any) => p.meta.location === "home");
    const away = fixture.participants.find((p: any) => p.meta.location === "away");

    const homeScore =
        fixture.scores.find(
            (s: any) => s.participant_id === home.id && s.description === "CURRENT"
        )?.score.goals ?? 0;

    const awayScore =
        fixture.scores.find(
            (s: any) => s.participant_id === away.id && s.description === "CURRENT"
        )?.score.goals ?? 0;

    return {
        id: fixture.id,
        league: {
            data: {
                name: fixture.league.name,
                country: fixture.league.country?.name,
            },
        },
        scores: {
            localteam_score: homeScore,
            visitorteam_score: awayScore,
        },
        participants: {
            data: [{ name: home.name }, { name: away.name }],
        },
        time: fixture.result_info ?? "FT",
    };
}

type NewsApiArticle = {
    title: string;
    description: string;
    url: string;
    urlToImage?: string | null;
    publishedAt: string;
    source: { name: string };
};

export default function SportsNewsHome() {
    const inertiaProps = usePage().props as any as {
        posts?: Article[];
        featured?: Article | null;
        leagues?: League[];
    };

    const [liveMatches, setLiveMatches] = useState<any[]>([]);
    const [loadingMatches, setLoadingMatches] = useState(true);

    const [news, setNews] = useState<NewsApiArticle[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [aflLeagues, setAflLeagues] = useState<any[]>([]);
    const [loadingAflLeagues, setLoadingAflLeagues] = useState(true);
    useEffect(() => {
        const fetchAflLeagues = async () => {
            const myHeaders = new Headers();
            myHeaders.append("x-rapidapi-key", "063f12792c6c3b3a3a84451d56701543");
            myHeaders.append("x-rapidapi-host", "v1.afl.api-sports.io");

            const requestOptions: RequestInit = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            try {
                const response = await fetch("https://v1.afl.api-sports.io/teams", requestOptions);
                const result = await response.json();
                setAflLeagues(result.response ?? []); // adjust based on API structure
            } catch (error) {
                console.error("Error fetching AFL leagues:", error);
            } finally {
                setLoadingAflLeagues(false);
            }
        };

        fetchAflLeagues();
    }, []);


    // --- Fetch news from NewsAPI ---
    useEffect(() => {
        let isMounted = true;

        const fetchNews = async () => {
            try {
                const res = await fetch(
                    "https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=20c31e36be55436a856baa46d7b82358"
                );
                const json = await res.json();
                if (isMounted && json.articles) setNews(json.articles);
            } catch (err) {
                console.error("Failed to fetch news", err);
            } finally {
                if (isMounted) setLoadingNews(false);
            }
        };

        fetchNews();
        return () => {
            isMounted = false;
        };
    }, []);
    useEffect(() => {
        const fetchLiveMatches = async () => {
            setLoadingMatches(true);
            try {
                const response = await fetch(
                    `https://api.sportmonks.com/v3/football/fixtures/between/2025-10-01/2025-10-08?api_token=ZfmJgx0vvmKJ5SBKLLJS1JfxvFAdm05RL1Tw6B8PYYUXkrAqjyxNFGlJoWz9&include=participants;state;season;league&filters=fixtureStates:1;fixtureLeagues:271`
                );
                const data = await response.json();

                // Sportmonks returns fixtures under `data`
                const transformed = data.data.map((fixture: any) => {
                    return {
                        id: fixture.id,
                        name: fixture.name ?? `${fixture.participants[0]?.name} vs ${fixture.participants[1]?.name}`,
                        status: fixture.state?.name ?? "Unknown",
                        venue: fixture.venue?.name ?? "N/A",
                        dateTimeGMT: fixture.starting_at ?? fixture.start_at,
                        teams: fixture.participants.map((p: any) => p.name),
                    };
                });

                setLiveMatches(transformed);
            } catch (err) {
                console.error("Error fetching live matches:", err);
            } finally {
                setLoadingMatches(false);
            }
        };

        fetchLiveMatches();
    }, []);

    // ---- Sample content ----
    const sampleFeatured: Article = {
        id: "f-1",
        title: "Epic Comeback Seals the Title — A Night to Remember",
        excerpt:
            "An unbelievable turnaround in the final 10 minutes gave City a historic win and a trophy to remember.",
        category: "Football",
        published_at: "2025-09-28",
        image: null,
    };

    const samplePosts: Article[] = [
        {
            id: 1,
            title: "Rising Star: 19-Year-Old Breaks Scoring Record",
            excerpt:
                "A younger talent is taking the league by storm with a streak of remarkable finishes.",
            category: "Basketball",
            published_at: "2025-09-29",
        },
        {
            id: 2,
            title: "Injury Update: Key Defender Out for Two Weeks",
            excerpt:
                "Club confirms medical scans and sets expected recovery timeline.",
            category: "Football",
            published_at: "2025-09-28",
        },
        {
            id: 3,
            title: "Tactical Preview: How Team Y Will Counter Team X",
            excerpt:
                "Our tactical analyst breaks down formations and matchups for the weekend.",
            category: "Analysis",
            published_at: "2025-09-27",
        },
    ];
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;

    // Calculate pagination
    const totalPages = Math.ceil(news.length / articlesPerPage);
    const paginatedNews = news.slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage
    );

    // Pagination handler
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    const sampleLeagues: League[] = [
        { id: "epl", name: "Premier League", country: "England" },
        { id: "la", name: "La Liga", country: "Spain" },
        { id: "serie", name: "Serie A", country: "Italy" },
    ];

    const featured =
        inertiaProps.featured ?? sampleFeatured;
    const posts =
        (inertiaProps.posts && inertiaProps.posts.length
            ? inertiaProps.posts
            : samplePosts) as Article[];
    const leagues =
        (inertiaProps.leagues && inertiaProps.leagues.length
            ? inertiaProps.leagues
            : sampleLeagues) as League[];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* ----- SEO Meta Tags ----- */}
            <Helmet>
                <title>QuickPlay Sports News - Live Scores, Headlines & Updates</title>
                <meta
                    name="description"
                    content="Stay updated with live cricket scores, AFL teams, latest sports news, and headlines from football, basketball, and more."
                />
                <meta property="og:title" content="QuickPlay Sports News" />
                <meta property="og:description" content="Live sports updates, scores, and latest news from all major leagues." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/assets/images/banner001.png" />
                <meta name="twitter:card" content="summary_large_image" />

                {/* JSON-LD Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsMediaOrganization",
                        "name": "QuickPlay Sports News",
                        "url": "https://yourdomain.com",
                        "logo": "https://yourdomain.com/assets/images/banner001.png",
                        "sameAs": [
                            "https://www.facebook.com",
                            "https://www.youtube.com",
                            "https://twitter.com"
                        ]
                    })}
                </script>

                {/* Pagination SEO */}
                {currentPage > 1 && (
                    <link
                        rel="prev"
                        href={`/news?page=${currentPage - 1}`}
                    />
                )}
                {currentPage < totalPages && (
                    <link
                        rel="next"
                        href={`/news?page=${currentPage + 1}`}
                    />
                )}
            </Helmet>

            <main className="container mx-auto px-4 py-10">
                {/* Hero + Quick headlines */}
                <section className="mb-8">
                    <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
                        <img src="./assets/images/banner001.png" alt="Sports News Banner 2" />

                    </div>
                </section>

                {/* Hero + Quick headlines */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ...rest of your content */}
                </section>
                <section className="mb-8">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="rounded-xl shadow-sm overflow-hidden h-24 md:h-28" // very thin
                    >
                        <SwiperSlide>
                            <img src="./assets/images/banner002.png" alt="Sports News Banner 2" />

                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="./assets/images/banner003.png" alt="Sports News Banner 3" />

                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="./assets/images/banner004.png" alt="Sports News Banner 4" />

                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="./assets/images/banner005.png" alt="Sports News Banner 5" />

                        </SwiperSlide>
                    </Swiper>
                </section>
                <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                    <ArrowUpIcon className="w-6 h-6" />
                    Post Your Advertisement Here
                    <ArrowUpIcon className="w-6 h-6" />
                </h3>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <article className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <section className="mt-10">
                                    <h3 className="text-2xl font-bold mb-4">Live Cricket Matches</h3>

                                    {loadingMatches ? (
                                        <p>Loading live matches...</p>
                                    ) : liveMatches.length === 0 ? (
                                        <p>No live matches at the moment.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {liveMatches.map((match) => (
                                                <div key={match.id} className="bg-white rounded-2xl shadow p-4">
                                                    <h4 className="font-bold text-lg mb-2">{match.name}</h4>
                                                    <p className="text-sm text-gray-500">Status: {match.status}</p>
                                                    <p className="text-sm text-gray-500">Venue: {match.venue}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Date: {new Date(match.dateTimeGMT).toLocaleString()}
                                                    </p>
                                                    <div className="mt-2 flex justify-between items-center">
                                                        <span className="font-semibold">{match.teams[0]}</span>
                                                        <span>0 - 0</span>
                                                        <span className="font-semibold">{match.teams[1]}</span>
                                                    </div>
                                                    <a
                                                        href="#"
                                                        className="mt-2 inline-block text-sm text-primary underline"
                                                    >
                                                        View Scorecard
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                            <section>
                                <div className="bg-white rounded-2xl shadow p-4 mt-4">
                                    <h3 className="text-lg font-semibold">AFL Teams</h3>
                                    {loadingAflLeagues ? (
                                        <p>Loading AFL leagues...</p>
                                    ) : aflLeagues.length === 0 ? (
                                        <p>No AFL leagues available.</p>
                                    ) : (
                                        <div className="mt-3 h-80 overflow-y-auto">
                                            {aflLeagues.map((league: any) => (
                                                <div
                                                    key={league.id}
                                                    className="flex items-center gap-4 text-base py-3 px-3 rounded hover:bg-gray-100"
                                                >
                                                    {league.logo && (
                                                        <img
                                                            src={league.logo}
                                                            alt={`${league.name} Logo`}
                                                            className="w-10 h-10 object-contain"
                                                        />
                                                    )}
                                                    <span className="font-medium">
                                                        {league.name} {league.country ? `• ${league.country}` : null}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </article>

                    <aside className="space-y-4">
                        <div className="bg-white rounded-2xl shadow p-4">
                            <h3 className="text-lg font-semibold">Top headlines</h3>
                            <ul className="mt-3 space-y-3">
                                {posts.slice(0, 4).map((p) => (
                                    <li key={p.id} className="border-b last:border-b-0 pb-3">
                                        <Link href={`/articles/${p.id}`} className="block">
                                            <p className="font-semibold">{p.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {p.published_at} • {p.category}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-4">
                            <h3 className="text-lg font-semibold">Leagues</h3>
                            <div className="mt-3 grid grid-cols-1 gap-2">
                                {leagues.map((l) => (
                                    <Link
                                        key={l.id}
                                        href={`/leagues/${l.id}`}
                                        className="text-sm py-2 px-3 rounded hover:bg-gray-100"
                                    >
                                        {l.name} {l.country ? `• ${l.country}` : null}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </section>

                {/* Latest articles grid */}
                <section className="mt-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">Latest News</h3>
                        {/* <Link href={route("news.index")} className="text-sm underline">
                            See all
                        </Link> */}

                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedNews.length > 0 ? (
                            paginatedNews.map((article, idx) => (
                                <article
                                    key={idx}
                                    className="bg-white rounded-xl shadow p-4 flex flex-col"
                                >
                                    <div className="h-40 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                                        {article.urlToImage ? (
                                            <img
                                                src={article.urlToImage}
                                                alt={article.title}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <span className="text-sm">No Image</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-primary">
                                            {article.source.name}
                                        </p>
                                        <h4 className="mt-2 font-semibold text-lg">{article.title}</h4>
                                        <p className="mt-2 text-sm text-gray-500">{article.description}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium inline-block"
                                        >
                                            Read
                                        </a>
                                        <span className="text-xs text-gray-400">
                                            {new Date(article.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </article>
                            ))
                        ) : loadingNews ? (
                            <div>Loading news...</div>
                        ) : (
                            <div>No news available.</div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-primaryBtnColor text-white" : "bg-gray-200"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>

                {/* Newsletter */}
                <section className="mt-12 bg-gradient-to-r from-primaryBtnColor to-primaryBtnColorHover text-white rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-2xl font-bold">Get the day's biggest stories</h4>
                            <p className="mt-2 text-sm opacity-90">
                                Subscribe to our newsletter and never miss a headline.
                            </p>
                        </div>
                        <form className="w-full md:w-auto flex items-center gap-3">
                            <input
                                type="email"
                                placeholder="you@email.com"
                                className="px-4 py-3 rounded-full text-black w-full md:w-72"
                            />
                            <button className="px-6 py-3 rounded-full bg-white text-primary font-medium">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
