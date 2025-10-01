import React, { useRef, Fragment, useEffect, useState as reactUseState } from 'react';
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import useState from "react-usestateref";
import removeValueFromArray from '@/lib/utility';
import DescriptionWidget from '@/Components/shared/partials/DescriptionWidget';
import SearchInput from '@/Components/elements/inputs/SearchInput';
import { useDebouncedCallback } from 'use-debounce';
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextInput from '@/Components/elements/inputs/TextInput';
import SkillWidget from '@/Components/shared/partials/SkillWidget';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function Talent({
    freelancers,
    users,
    skillCategories,
    jobCategories,
    filters,
}: {
    freelancers: any;
    users: any;
    skillCategories: any;
    jobCategories: any;
    filters: any;
}) {
    const [searchParam, setSearchParam] = useState("");
    const [page, setPage] = useState(filters.page ?? 1);
    const [rowPerPage, setRowPerPage] = useState(filters.perPage ?? 24);
    const [filterSkillCategories, setFilterSkillCategories, filterSkillCategoriesRef] = useState(filters.skillCategories ?? "");
    const [filterJobCategories, setFilterJobCategories, filterJobCategoriesRef] = useState(filters.jobCategories ?? "");
    const [filterMinRate, setFilterMinRate, filterMinRateRef] = useState(filters.MinRate ?? 0);
    const [filterMaxRate, setFilterMaxRate, filterMaxRateRef] = useState(filters.MinRate ?? 100);

    const initialRender = useRef(true);

    const resetSearch = () => {
        setSearchParam("");
        revisitPage();
    };

    const debouncedHandleSearch = useDebouncedCallback(
        (value: any) => {
            setSearchParam(value);
            revisitPage();
        },
        300
    );

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            revisitPage();
        }
    }, [searchParam]);

    function revisitPage() {
        router.get(
            route("client.talent"),
            {
                page: page,
                rowPerPage: rowPerPage,
                searchParam: searchParam,
                skillCategories: filterSkillCategoriesRef.current,
                jobCategories: filterJobCategoriesRef.current,
                minRate: filterMinRateRef.current,
                maxRate:
                    filterMaxRateRef.current > filterMinRateRef.current
                        ? filterMaxRateRef.current
                        : 100,
            },
            {
                replace: true,
                preserveState: true,
                preserveScroll: true,
            }
        );
    }

    function setSkillCategories(checked: boolean, value: string) {
        let array = filterSkillCategories.split(",");
        switch (checked) {
            case true:
                !array.includes(value.toString()) && array.push(value.toString());
                break;
            case false:
                array.includes(value.toString()) && (array = removeValueFromArray(array, value.toString()));
                break;
        }
        array.includes("") && (array = removeValueFromArray(array, ""));
        setFilterSkillCategories(array.toString());
        revisitPage();
    }

    function setJobCategories(checked: boolean, value: string) {
        let array = filterJobCategories.split(",");
        switch (checked) {
            case true:
                !array.includes(value.toString()) && array.push(value.toString());
                break;
            case false:
                array.includes(value.toString()) && (array = removeValueFromArray(array, value.toString()));
                break;
        }
        array.includes("") && (array = removeValueFromArray(array, ""));
        setFilterJobCategories(array.toString());
        revisitPage();
    }

    useEffect(() => {
        const getSearchParams = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('searchParam') || '';
        };
        setSearchParam(getSearchParams());
    }, [window.location.search]);

    function setRateRange(minRateValue: any, maxRateValue: any) {
        setFilterMinRate(minRateValue);
        setFilterMaxRate(maxRateValue);
        revisitPage();
    }

    function setRateInput(rateValue: any, type: any) {
        if (type == "MAX") {
            setFilterMaxRate(rateValue);
        } else if (type == "MIN") {
            setFilterMinRate(rateValue);
        }
        setTimeout(() => {
            revisitPage();
        }, 300);
    }

    // --- Esports News State & Fetch ---
    const [esportsNews, setEsportsNews] = reactUseState<any[]>([]);
    useEffect(() => {
        const fetchEsportsNews = async () => {
            try {
                const res = await fetch("https://esports-news.p.rapidapi.com/news", {
                    method: "GET",
                    headers: {
                        "X-RapidAPI-Host": "esports-news.p.rapidapi.com",
                        "X-RapidAPI-Key": "0a9643fbc4msh82a640a52553019p11b165jsn6196371d6088",
                    },
                });
                const data = await res.json();
                setEsportsNews(data);
            } catch (err) {
                console.error("Error fetching esports news:", err);
            }
        };
        fetchEsportsNews();
    }, []);

    // --- SportDevs Matches/Games/Lineups Fetch ---
    const [esportsMatches, setEsportsMatches] = reactUseState<any[]>([]);
    useEffect(() => {
        const fetchEsportsMatches = async () => {
            try {
                const res = await fetch(
                    "https://esports.sportdevs.com/matches-games-lineups?esports_game_id=eq.1&team_id=eq.38412",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer LFPnsRjtj0OOSBnrA6pUiA",
                        },
                    }
                );
                const data = await res.json();
                setEsportsMatches(data);
            } catch (err) {
                console.error("Error fetching esports matches:", err);
            }
        };
        fetchEsportsMatches();
    }, []);
    const [championRotations, setChampionRotations] = reactUseState<any>(null);

    useEffect(() => {
        const fetchChampionRotations = async () => {
            try {
                const res = await fetch("https://br1.api.riotgames.com/lol/platform/v3/champion-rotations", {
                    method: "GET",
                    headers: {
                        "X-Riot-Token": "RGAPI-862c7ff8-709c-43e5-aaaf-01716015da8c"
                    },
                });
                const data = await res.json();
                setChampionRotations(data);
            } catch (err) {
                console.error("Error fetching champion rotations:", err);
            }
        };
        fetchChampionRotations();
    }, []);

    // --- SportDevs Live Matches Fetch ---
    const [esportsLiveMatches, setEsportsLiveMatches] = reactUseState<any[]>([]);
    useEffect(() => {
        const fetchEsportsLiveMatches = async () => {
            try {
                const res = await fetch("https://esports.sportdevs.com/matches-live", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer LFPnsRjtj0OOSBnrA6pUiA",
                    },
                });
                const data = await res.json();
                setEsportsLiveMatches(data);
            } catch (err) {
                console.error("Error fetching live esports matches:", err);
            }
        };
        fetchEsportsLiveMatches();
    }, []);

    // --- PlayStation Store API Data ---
    const [psStoreData, setPsStoreData] = reactUseState<any>(null);
    useEffect(() => {
        const fetchPsStoreData = async () => {
            try {
                const response = await fetch("https://store.playstation.com/store/api/chihiro/00_09_000/container/ch/de/999/STORE-MSF75508-FULLGAMES?size=20&start=0&sort=release_date");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPsStoreData(data);
            } catch (error) {
                console.error("Error fetching PlayStation Store data:", error);
            }
        };
        fetchPsStoreData();
    }, []);

    return (
        <AppLayout isClientHeader={true} isHeader={false} isFooter={true}>
            <Head title="Talent" />
            <section className="flex flex-col min-h-screen px-4 py-20 mt-20 sm:px-6 lg:px-8">
                <div className="flex items-center w-full gap-1 py-5 sm:w-1/2 ">
                    <SearchInput
                        id="search"
                        className="self-center block w-auto mt-2 font-semibold placeholder:text-sm font-Inter"
                        defaultValue={searchParam}
                        searchLoader={false}
                        placeholder={'Search'}
                        resetSearch={resetSearch}
                        autoComplete="search"
                        onChange={(e) =>
                            debouncedHandleSearch(e.target.value)
                        }
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side: News & Matches */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold ">News</h2>
                        {esportsNews.length > 0 && (
                            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                                {esportsNews.map((news, idx) => (
                                    <div key={idx} className="p-4 border rounded shadow-sm">
                                        <h3 className="font-semibold">{news.title}</h3>
                                        <p className="text-sm text-gray-600">{news.description}</p>
                                        <Link href={news.url} target="_blank" className="text-blue-500 underline mt-2 block">Read more</Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        <h2 className="text-2xl font-semibold mt-8">league of legends Matches / Lineups</h2>
                        {esportsMatches.length > 0 && (
                            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                                {esportsMatches.map((match, idx) => (
                                    <div key={idx} className="p-4 border rounded shadow-sm">
                                        <h3 className="font-semibold">Game ID: {match.esports_game_id}</h3>
                                        <h4 className="font-medium">Team ID: {match.team_id}</h4>
                                        <div className="mt-2">
                                            {match.players.map((player: any, pidx: number) => (
                                                <div key={pidx} className="border-b py-1">
                                                    <p><strong>{player.player_name}</strong> ({player.role}) - {player.character}</p>
                                                    <p>Kills: {player.kills}, Deaths: {player.deaths}, Assists: {player.assists}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Live Matches */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold">Live Matches</h2>
                        {esportsLiveMatches.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                {esportsLiveMatches.map((liveMatch, idx) => (
                                    <div key={idx} className="p-4 border rounded shadow-sm">
                                        <h3 className="font-semibold">{liveMatch.name || `Match ${idx + 1}`}</h3>
                                        <p>Game ID: {liveMatch.esports_game_id}</p>
                                        <p>State ID: {liveMatch.state_id}</p>
                                        {liveMatch.teams && liveMatch.teams.map((team: any, tidx: number) => (
                                            <div key={tidx} className="mt-2">
                                                <p><strong>Team:</strong> {team.name}</p>
                                                <p>Score: {team.score}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-gray-500">No live matches currently.</p>
                        )}
                    </div>
                </div>

                {/* --- PlayStation Store Games Section --- */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">PlayStation Store Games</h2>
                    {psStoreData && psStoreData.links && psStoreData.links.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {psStoreData.links.map((game: any, index: number) => (
                                <div key={index} className="border rounded shadow p-4 flex flex-col">
                                    {/* Game Image */}
                                    {game.images && game.images.length > 0 && (
                                        <img
                                            src={game.images[0].url}
                                            alt={game.name}
                                            className="w-full h-48 object-cover rounded mb-4"
                                        />
                                    )}
                                    {/* Game Name */}
                                    <h3 className="text-lg font-bold mb-2">{game.name}</h3>
                                    {/* Release Date */}
                                    <p className="text-sm text-gray-600 mb-1">
                                        Release Date: {new Date(game.release_date).toLocaleDateString()}
                                    </p>
                                    {/* Price */}
                                    {game.default_sku && (
                                        <p className="text-sm font-semibold mb-2">
                                            Price: {game.default_sku.display_price}
                                        </p>
                                    )}
                                    {/* Platforms */}
                                    {game.playable_platform && (
                                        <p className="text-sm mb-2">
                                            Platforms: {game.playable_platform.join(", ")}
                                        </p>
                                    )}
                                    {/* Link to Store */}
                                    <a
                                        href={`https://store.playstation.com$`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto text-blue-600 underline"
                                    >
                                        View on Store
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading PlayStation Store games...</p>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
