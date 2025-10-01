import SearchInput from "@/Components/elements/inputs/SearchInput";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import MessageArea from "@/Components/elements/inputs/MessageArea";
import { ArrowDownTrayIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, DocumentCheckIcon, PercentBadgeIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import FileUpload from "./Partials/FileUpload";
import EmojiPicker from "emoji-picker-react";

export default function ClientJobView({
    filters,
    chat_id,
    messages: initialMessages,
    user,
    receiver,
    chats,
    offer,
    proposal,
}: {
    filters: {
        searchParam: string;
    };
    chat_id: number;
    messages: any;
    user: any;
    receiver: any;
    chats: any;
    offer: any;
    proposal: any;
}) {
    const [messages, setMessages] = useState(initialMessages);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [creditDropdown, setCreditDropdown] = useState(true);

    const webSocketChannel = `chat.${chat_id}`;

    const connectWebSocket = () => {
        window.Echo.private(webSocketChannel).listen(
            "GotMessage",
            async (e: any) => {
                e.message;
                console.log("GotMessage", e);
                await getMessages();
            }
        );
    };
    const { data, setData, processing, post, errors, reset } = useForm({
        message: '',
        chat_id: chat_id,
        attachments: [],
    });



    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        {
            post(route('freelancer.messages.send'),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setData({ message: '', chat_id: chat_id, attachments: [] });
                    },
                    onError: (e) => {

                    },
                }
            )

        };
    };

    const onEmojiClick = (emojiObject: any) => {
        setData({ ...data, message: data.message + emojiObject.emoji });
        setShowEmojiPicker(false);
    };




    const getMessages = async () => {
        try {
            const response = await axios.get(route('freelancer.messages.get', { chat_id: chat_id }));
            setMessages(response.data);
            console.log(response.data);
        } catch (error) {
            // console.error('Failed to fetch messages:', error);
        }
    };

    useEffect(() => {
        connectWebSocket();
        return () => {
            window.Echo.leave(webSocketChannel);
        };
    }, []);


    const initialRender = useRef(true);
    const url = window.location.pathname;
    const resetSearch = () => {
        setSearchParam("");
        revisitPage();
    };

    const debouncedHandleSearch = useDebouncedCallback(
        (value: any) => {
            setSearchParam(value);
            revisitPage();
        },
        1000
    );

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        revisitPage();
    }
        , [searchParam]);


    function revisitPage() {
        router.get(
            url,
            {
                searchParam: searchParam,

            },
            {
                replace: true,
                preserveState: true,
            }
        );
    }
    const handleDownload = (file: any) => {
        const link = document.createElement('a');
        link.href = file.preview || file.path_url;
        link.download = file.file_name || file.newName || file.originalName;
        link.click();
    };

    const timeline = [
        {
            id: 1,
            title: 'Proposal submitted',
            content: 'Navin M is actively working on the project at this time.',
            status: 'completed',
        },
        {
            id: 2,
            title: 'Contract offer',
            content: 'Successfully initiated the project.',
            status: proposal?.proposal_status === 'offered' ? 'current' : 'completed'
        },
        {
            id: 3,
            title: 'Accept contract',
            content: 'Completed phone screening with',
            status: offer?.status === 'pending' ? 'current' : offer?.status === 'accepted' ? 'completed' : offer?.status === 'completed' ? 'completed' : 'upcoming',
        },
        {
            id: 4,
            title: 'Contract end',
            content: 'Advanced to interview by',
            status: offer?.status === 'completed' ? 'completed' : 'upcoming',
        },

    ]

    return (
        <>
            <AppLayout isFreelancerHeader={true} isHeader={false} isFooter={false} >
                <Head title="Messages" />
                <section className="flex justify-center px-4 pt-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <div className="flex flex-col w-full gap-2 lg:flex-row">
                        <div className="flex flex-col w-full md:flex-row lg:w-1/4">

                            <div className="w-full py-6 lg:w-full md:w-1/2">
                                <div className="w-full py-6">
                                    <h2 className="text-3xl font-semibold font-Inter">Messages</h2>
                                </div>

                                <div className="w-full ">
                                    <SearchInput
                                        id="search"
                                        className="w-full mt-2 font-semibold placeholder:text-sm"
                                        isFocused
                                        defaultValue={searchParam}
                                        placeholder={"Search"}
                                        searchLoader={false}
                                        resetSearch={resetSearch}
                                        autoComplete="search"
                                        onChange={(e) => debouncedHandleSearch(e.target.value)}
                                    />
                                </div>
                                {chats?.data?.length > 0 ?
                                    <div className="flex w-full p-4 mt-6  md:min-h-[320px] lg:min-h-[600px] lg:rounded-t-3xl rounded-xl bg-cardsColor" >
                                        <div className="flex flex-col w-full gap-3">
                                            {chats.data.map((chat: any) => (
                                                <Link
                                                    href={`/freelancer/messages/${chat.proposal_id}`}
                                                    key={chat?.id}
                                                    className={`flex flex-col items-center w-full gap-2 p-4 rounded-2xl ${chat_id === chat.id ? "bg-primary text-white" : ""}`}>
                                                    <div className="flex flex-row items-center w-full gap-1">
                                                        <div className="relative flex-shrink-0 gap-1 w-14">
                                                            <div className={`absolute w-1.5 h-1.5  rounded-full left-1 top-1 ring-2 ring-white ${chat?.client?.active_status ? "bg-green-500" : "bg-red-500"}`}></div>
                                                            <img
                                                                src={chat?.client?.avatar}
                                                                alt="user avatar"
                                                                className="w-12 h-12 rounded-full"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex flex-wrap items-center justify-between w-full ">
                                                                <div className="flex flex-row gap-2 ">
                                                                    <span className="overflow-hidden text-base font-medium first-letter:capitalize text-ellipsis whitespace-nowrap font-Inter ">
                                                                        {chat?.client?.full_name}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-row items-end gap-2 ">
                                                                    <span className="text-xs font-medium text-end font-Inter ">{chat?.created_at_human}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row w-3/4 gap-2">
                                                                <span className="overflow-hidden text-xs font-medium first-letter:capitalize text-ellipsis whitespace-nowrap font-Inter ">
                                                                    {chat?.last_message?.sender_id === user.id ? "You: " : chat?.client?.first_name + ": "}
                                                                    {chat?.last_message?.message ?? "No Message"}
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    :
                                    <div className="flex items-center justify-center w-full h-full mt-6 rounded-3xl bg-cardsColor" >
                                        <span className="text-sm font-medium font-Inter text-textSecondary">No Conversation found</span>
                                    </div>
                                }
                            </div>

                        </div>
                        <div className="flex items-center justify-center max-h-[700px] w-full px-4 lg:w-3/4 ">

                            {!chat_id ? (
                                <div>
                                    <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-6 rounded-t-3xl " >
                                        <img src="/assets/Icons/client/messages.png" alt="chat Icon" className="w-40 h-36 sm:h-72 sm:w-96" />
                                        <h1 className="text-3xl font-semibold font-Inter" >Welcome to Messages</h1>
                                        <span className="text-sm font-medium font-Inter text-textSecondary">Once you connect with a freelancer, you’ll be able to chat and collaborate here</span>
                                    </div>
                                </div>)
                                : (
                                    <div className="flex flex-col w-full h-full gap-36 sm:gap-1 lg:flex-row " >
                                        <div className="flex flex-col w-full lg:w-2/3" >
                                            <div className="flex flex-col h-screen -mb-40">
                                                {/* Profile Section */}
                                                <div className="flex items-center p-4 shadow-bottom-lg ">
                                                    <div className="flex flex-col">
                                                        <h2 className="text-xl font-bold first-letter:capitalize">{receiver.full_name}</h2>
                                                    </div>
                                                </div>
                                                {/* Chat Section */}
                                                <div className="flex-grow py-4 overflow-y-auto max-h-[500px] ">
                                                    {messages.map((msg: any) => (
                                                        <div
                                                            key={msg?.id}
                                                            className={`flex`}
                                                        >
                                                            <div className={`w-full flex flex-row px-4 py-2  `}>
                                                                <div className="relative flex items-start w-10 gap-1 ">

                                                                    <div className="relative flex items-start w-10 gap-1 ">
                                                                        <div className={`absolute w-1.5 h-1.5  rounded-full left-1 top-1 ring-2 ring-white ${msg?.sender?.active_status ? "bg-green-500" : "bg-red-500"}`}
                                                                        >
                                                                        </div>
                                                                        <img
                                                                            className="w-[40px] h-[40px] rounded-full"
                                                                            src={msg?.sender?.avatar}
                                                                            alt="avatar"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col space-x-2">
                                                                    <div className="flex flex-row items-center justify-start w-full gap-4 ml-2 t">
                                                                        <div className="flex flex-col ">
                                                                            <p className="text-sm font-semibold text-nowrap first-letter:capitalize ">{msg?.sender?.full_name}</p>
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <p className="text-xs text-gray-500 text-nowrap ">{msg?.created_at_human}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-start gap-4 item">
                                                                        <p className="text-base text-gray-800 ">{msg?.message}</p>
                                                                        {msg?.attachments?.map((attachment: any) => (
                                                                            <div className="flex items-center justify-between p-2 bg-blue-200 rounded-lg">
                                                                                <div className="flex-1 text-left">
                                                                                    <p className="text-sm text-gray-800">{attachment?.file_name || attachment?.originalName}</p>
                                                                                    <p className="text-xs text-gray-500">{(attachment?.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                                                </div>
                                                                                <button
                                                                                    type='button'
                                                                                    onClick={() => handleDownload(attachment)}
                                                                                    className="p-1 ml-2 text-blue-500 bg-white rounded-full"
                                                                                >
                                                                                    <ArrowDownTrayIcon className="w-6 h-6" />
                                                                                </button>

                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Input Section */}
                                                <div className="p-2 bg-white rounded-t-2xl shadow-up-3xl">
                                                    <form onSubmit={submit} className="flex flex-col ">
                                                        <div>
                                                            <MessageArea
                                                                id="message"
                                                                name="message"
                                                                rows={4}
                                                                placeholder='Send a message...'
                                                                isFocused={true}
                                                                value={data.message}
                                                                className="block w-full p-2 mt-2 h-26 placeholder:text-base font-Inter"
                                                                onChange={(e) => setData('message', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between py-4">
                                                            <div className="flex flex-row items-center justify-center gap-2">
                                                                <FileUpload
                                                                    setData={setData}
                                                                    type={'create'}
                                                                />

                                                                {/* Emoji Picker button */}
                                                                <button type="button" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                                                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M8.63042 12.5108C9.25474 12.5108 9.76084 12.0047 9.76084 11.3804C9.76084 10.7561 9.25474 10.25 8.63042 10.25C8.00611 10.25 7.5 10.7561 7.5 11.3804C7.5 12.0047 8.00611 12.5108 8.63042 12.5108Z" fill="black" />
                                                                        <path d="M12.0031 18.4996C9.87371 18.4996 8.08283 17.1152 7.51603 15.2259C7.50017 15.1696 7.49767 15.1105 7.50873 15.0531C7.51978 14.9958 7.54408 14.9418 7.57969 14.8955C7.61529 14.8492 7.66123 14.8118 7.71383 14.7864C7.76642 14.761 7.82423 14.7482 7.88264 14.7491H16.1193C16.1777 14.7482 16.2355 14.761 16.2881 14.7864C16.3407 14.8118 16.3866 14.8492 16.4222 14.8955C16.4578 14.9418 16.4821 14.9958 16.4932 15.0531C16.5043 15.1105 16.5018 15.1696 16.4859 15.2259C15.9238 17.1152 14.1324 18.4996 12.0031 18.4996Z" fill="black" />
                                                                        <path d="M15.3804 12.5108C16.0047 12.5108 16.5108 12.0047 16.5108 11.3804C16.5108 10.7561 16.0047 10.25 15.3804 10.25C14.7561 10.25 14.25 10.7561 14.25 11.3804C14.25 12.0047 14.7561 12.5108 15.3804 12.5108Z" fill="black" />
                                                                        <path d="M12 22.25C17.3848 22.25 21.75 17.8848 21.75 12.5C21.75 7.11522 17.3848 2.75 12 2.75C6.61522 2.75 2.25 7.11522 2.25 12.5C2.25 17.8848 6.61522 22.25 12 22.25Z" stroke="black" stroke-width="1.00189" stroke-miterlimit="10" />
                                                                    </svg>
                                                                </button>
                                                                {showEmojiPicker && (
                                                                    <div className="absolute z-10">
                                                                        <EmojiPicker onEmojiClick={onEmojiClick} />
                                                                    </div>
                                                                )}

                                                            </div>
                                                            <div>
                                                                <button
                                                                    type="submit"
                                                                    disabled={processing}
                                                                    className="px-4 py-1 ml-2 border-2 text-block rounded-2xl hover:bg-blue-600 hover:text-white"
                                                                >
                                                                    Send
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        {chat_id &&
                                            <div className="flex flex-col w-full mt-10 sm:px-3 lg:w-1/3" >
                                                <div className="p-3 bg-cardsColor rounded-2xl">
                                                    <div className="flex flex-col items-center justify-center ">
                                                        <div className="relative flex items-start w-16 gap-1 ">
                                                            <div className={`absolute w-3 h-3  rounded-full left-1 top-1 ring-2 ring-white ${receiver?.active_status ? "bg-green-500" : "bg-red-500"}`}></div>
                                                            <img
                                                                className="w-[60px] h-[60px] rounded-full"
                                                                src={receiver?.avatar}
                                                                alt="avatar"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-2 text-start">
                                                            <div className="flex flex-col gap-4 text-center">
                                                                <span className="text-base font-semibold first-letter:capitalize font-Inter ">{receiver?.full_name}</span>
                                                                <span className="text-sm font-medium font-Inter text-textSecondary">{receiver?.country} - {receiver?.user_country_time}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row gap-8 py-6 text-start">

                                                            <div className="flex flex-row gap-2">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M23.1853 11.6962C23.1525 11.6222 22.3584 9.86062 20.5931 8.09531C18.2409 5.74312 15.27 4.5 12 4.5C8.72999 4.5 5.75905 5.74312 3.40687 8.09531C1.64155 9.86062 0.843741 11.625 0.814679 11.6962C0.772035 11.7922 0.75 11.896 0.75 12.0009C0.75 12.1059 0.772035 12.2097 0.814679 12.3056C0.847491 12.3797 1.64155 14.1403 3.40687 15.9056C5.75905 18.2569 8.72999 19.5 12 19.5C15.27 19.5 18.2409 18.2569 20.5931 15.9056C22.3584 14.1403 23.1525 12.3797 23.1853 12.3056C23.2279 12.2097 23.25 12.1059 23.25 12.0009C23.25 11.896 23.2279 11.7922 23.1853 11.6962ZM12 18C9.11437 18 6.59343 16.9509 4.50655 14.8828C3.65031 14.0312 2.92183 13.0602 2.34374 12C2.9216 10.9396 3.65011 9.96858 4.50655 9.11719C6.59343 7.04906 9.11437 6 12 6C14.8856 6 17.4066 7.04906 19.4934 9.11719C20.3513 9.96843 21.0814 10.9395 21.6609 12C20.985 13.2619 18.0403 18 12 18ZM12 7.5C11.11 7.5 10.2399 7.76392 9.49992 8.25839C8.7599 8.75285 8.18313 9.45566 7.84253 10.2779C7.50194 11.1002 7.41282 12.005 7.58646 12.8779C7.76009 13.7508 8.18867 14.5526 8.81801 15.182C9.44735 15.8113 10.2492 16.2399 11.1221 16.4135C11.995 16.5872 12.8998 16.4981 13.7221 16.1575C14.5443 15.8169 15.2471 15.2401 15.7416 14.5001C16.2361 13.76 16.5 12.89 16.5 12C16.4987 10.8069 16.0242 9.66303 15.1806 8.81939C14.337 7.97575 13.1931 7.50124 12 7.5ZM12 15C11.4066 15 10.8266 14.8241 10.3333 14.4944C9.83993 14.1648 9.45541 13.6962 9.22835 13.1481C9.00129 12.5999 8.94188 11.9967 9.05763 11.4147C9.17339 10.8328 9.45911 10.2982 9.87867 9.87868C10.2982 9.45912 10.8328 9.1734 11.4147 9.05764C11.9967 8.94189 12.5999 9.0013 13.148 9.22836C13.6962 9.45542 14.1648 9.83994 14.4944 10.3333C14.824 10.8266 15 11.4067 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15Z" fill="#004AAD" />
                                                                </svg>
                                                                <Link
                                                                    href={`/freelancer/proposals/${proposal?.id}`}
                                                                    type="button"
                                                                    className=" text-primary"
                                                                >
                                                                    View proposal
                                                                </Link>
                                                            </div>

                                                        </div>
                                                        <div className="flex flex-col w-full px-4 py-1 bg-white rounded-2xl">
                                                            <div className="flex flex-row items-center justify-between py-2">
                                                                <div className="flex flex-row items-center gap-2">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M14.2188 18.2742C14.3975 18.6247 14.8281 18.7661 15.1649 18.5629C16.8724 17.533 18.2382 16.0127 19.0787 14.1925C20.0191 12.1562 20.2475 9.86277 19.7274 7.68091C19.2072 5.49905 17.9686 3.55543 16.2106 2.16238C14.4526 0.769336 12.2774 0.00776636 10.0344 5.90361e-05C7.79137 -0.00764829 5.61091 0.738954 3.84339 2.11989C2.07588 3.50082 0.823949 5.43588 0.288793 7.61411C-0.246363 9.79235 -0.0336676 12.0872 0.892699 14.13C1.72072 15.9559 3.07595 17.4856 4.77634 18.5272C5.11179 18.7327 5.54332 18.5943 5.72442 18.245C5.90551 17.8958 5.76731 17.4684 5.43431 17.2589C4.01654 16.3672 2.88614 15.0765 2.19013 13.5417C1.39573 11.7899 1.21334 9.82193 1.67225 7.95401C2.13117 6.08609 3.20475 4.42669 4.72047 3.24249C6.23618 2.05828 8.10601 1.41804 10.0295 1.42465C11.9529 1.43126 13.8183 2.08434 15.3258 3.27893C16.8334 4.47352 17.8955 6.14026 18.3416 8.01129C18.7877 9.88232 18.5918 11.849 17.7854 13.5952C17.0788 15.1252 15.9396 16.4082 14.5157 17.2901C14.1813 17.4973 14.0401 17.9238 14.2188 18.2742Z" fill="black" />
                                                                        <path d="M12.3081 14.733C12.4858 15.0975 12.9285 15.2525 13.2685 15.0316C14.1929 14.4311 14.9383 13.5845 15.4166 12.5808C16.0006 11.3552 16.1516 9.96769 15.845 8.64509C15.5384 7.32248 14.7923 6.14296 13.7287 5.29924C12.665 4.45553 11.3466 3.9975 9.98892 4.00001C8.63125 4.00252 7.31456 4.46541 6.254 5.31305C5.19345 6.16069 4.45172 7.34296 4.15002 8.66669C3.84832 9.99042 4.00448 11.3773 4.59299 12.6008C5.07493 13.6027 5.82346 14.4466 6.75011 15.0436C7.09097 15.2633 7.53305 15.1066 7.70943 14.7415C7.88582 14.3764 7.72826 13.942 7.39639 13.709C6.76521 13.2659 6.25404 12.6666 5.91626 11.9643C5.47177 11.0403 5.35383 9.99276 5.58169 8.99299C5.80956 7.99322 6.36976 7.10029 7.17077 6.46009C7.97177 5.8199 8.96622 5.47029 9.99163 5.46839C11.017 5.4665 12.0128 5.81243 12.8161 6.44966C13.6195 7.0869 14.183 7.97776 14.4146 8.97668C14.6461 9.9756 14.532 11.0235 14.091 11.9492C13.7558 12.6527 13.2468 13.254 12.6173 13.6994C12.2863 13.9336 12.1303 14.3686 12.3081 14.733Z" fill="black" />
                                                                    </svg>

                                                                    <h1 className="text-base font-medium text-left font-Inter">Status</h1>
                                                                </div>

                                                                {creditDropdown ? (
                                                                    <ChevronDownIcon className="w-4 h-4 " onClick={() => setCreditDropdown(false)} />

                                                                ) : (
                                                                    <ChevronUpIcon className="w-4 h-4 " onClick={() => setCreditDropdown(true)} />
                                                                )}
                                                            </div>
                                                            {creditDropdown && (
                                                                <div className="relative flex flex-col py-4">
                                                                    <div className="flow-root">
                                                                        <ul role="list" className="-mb-8">
                                                                            {timeline?.map((event, eventIdx) => (
                                                                                <li key={event?.id}>
                                                                                    <div className="relative pb-8">
                                                                                        {eventIdx !== timeline?.length - 1 ? (
                                                                                            <span aria-hidden="true" className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${event.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                                                        ) : null}
                                                                                        <div className="relative flex space-x-3">
                                                                                            <div>
                                                                                                <span
                                                                                                    className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${event.status === 'completed' ? 'border-2 border-blue-500 bg-blue-500' : event.status === 'current' ? 'border-2 border-blue-500 bg-white' : 'border-2 border-gray-200 bg-white'} `}
                                                                                                >
                                                                                                    {event?.status === 'completed' ? (
                                                                                                        <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                                                                                    ) : (
                                                                                                        <span className={`flex  items-center justify-center  ${event?.status === 'current' ? 'text-blue-600 ' : 'text-black'} `}>
                                                                                                            {event?.id === 1 ? (
                                                                                                                <CheckIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                                                                                                            ) : event?.id === 2 ? (
                                                                                                                <PercentBadgeIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                                                                                                            ) : event?.id === 3 ? (
                                                                                                                <DocumentCheckIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                                                                                                            ) : event?.id === 4 ? (
                                                                                                                <RocketLaunchIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                                                                                                            ) : (
                                                                                                                <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                                                                                            )}


                                                                                                        </span>
                                                                                                    )}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="flex lg:pl-2">
                                                                                                <div className="flex flex-col justify-start gap-1">
                                                                                                    <h3 className={`text-base font-semibold  text-start font-Inter ${event.status === 'current' ? 'text-black' : 'text-gray-500'}`}>
                                                                                                        {event?.title}
                                                                                                    </h3>
                                                                                                    {event.id === 1 ?
                                                                                                        event.status === 'completed' ?
                                                                                                            <div className="flex flex-col">
                                                                                                                <p className="text-xs ">{proposal?.created_at_human}</p>
                                                                                                            </div>
                                                                                                            : null
                                                                                                        : event.id === 2 ?
                                                                                                            event.status === 'completed' ?
                                                                                                                <div className="flex flex-col">
                                                                                                                    <p className="text-xs text-gray-500 ">
                                                                                                                    </p>
                                                                                                                </div>

                                                                                                                : event.status === 'current' ?
                                                                                                                    <div className="flex flex-col">
                                                                                                                        <div className="flex flex-col">
                                                                                                                            <p className="text-xs ">Awaiting offer from client</p>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    : null
                                                                                                            : event.id === 3 ?
                                                                                                                event.status === 'completed' ?
                                                                                                                    <p className="text-left">Feedback submit completed</p>
                                                                                                                    : event.status === 'current' ?
                                                                                                                        <p className="text-left">Feedback submit</p>
                                                                                                                        : event.status === 'upcoming' ?
                                                                                                                            <p className="text-left"></p>

                                                                                                                            : null
                                                                                                                : event.id === 4 ?
                                                                                                                    event.status === 'completed' ?
                                                                                                                        <p className="text-left">Successfully completed the project.</p>
                                                                                                                        : event.status === 'current' ?
                                                                                                                            <p className="text-left">Advanced to interview by</p>
                                                                                                                            : event.status === 'upcoming' ?
                                                                                                                                <p className="text-left"></p>
                                                                                                                                : null
                                                                                                                    : null}
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                    <div>

                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )}

                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
