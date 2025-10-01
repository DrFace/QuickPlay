import { FormEventHandler, useState } from "react";
import { Head, useForm } from "@inertiajs/react";

import classNames from "classnames";
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/elements/inputs/InputError";
import { PrimaryButton, PrimaryLink } from "@/Components/elements/buttons/PrimaryButton";

export default function CreateProduct({ page, type }: { page: any, type: any }) {
    const bRoutes = [
        { name: "Dashboard", hasArrow: true, link: route("admin.dashboard") },
        { name: `${type == "create" ? "Create" : "Edit Pages"}`, hasArrow: true, link: "" },
    ];
    const { data, setData, post, errors } = useForm({
        terms_of_service: page?.terms_of_service?.content,
        privacy_policy: page?.privacy_policy?.content,
        //ca_notice_at_collection: page?.ca_notice_at_collection?.content,
        user_agreement: page?.user_agreement?.content,
        about_us: page?.about_us?.content,

    });

    const [openTab, setOpenTab] = useState<number>(1);

    const handleTabClick = (tab: number) => {
        setOpenTab(tab);
    };

    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link"],
            ["clean"],
        ],
        clipboard: { matchVisual: false },
    };

    const formats = [
        "header", "font", "size", "bold", "italic", "underline", "strike",
        "blockquote", "list", "bullet", "indent", "link", "image", "color",
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.pages.update", { page: page.id }));
    };

    const title = type == "create" ? "Create Brand" : "Edit Pages";
   // console.log(page);
    return (
        <Authenticated bRoutes={bRoutes}>
            <Head title={title} />
            <div className="mb-4 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {title}
                    </h2>
                </div>
            </div>
            <div className="flex items-center justify-center font-sans bg-gray-100">
                <div className="w-full max-w-screen-lg p-2">
                    <div className="flex flex-col p-2 mb-4 space-x-4 overflow-x-auto bg-white rounded-lg shadow-md sm:flex-row">
                        <button
                            onClick={() => handleTabClick(1)}
                            className={classNames(
                                "flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all  duration-300",
                                { "bg-primary text-white": openTab === 1 }
                            )}
                        >
                            Terms of Service
                        </button>
                        <button
                            onClick={() => handleTabClick(2)}
                            className={classNames(
                                "flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300",
                                { "bg-primary text-white": openTab === 2 }
                            )}
                        >
                            Privacy Policy
                        </button>
                        {/* <button
                            onClick={() => handleTabClick(3)}
                            className={classNames(
                                "flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300",
                                { "bg-primary text-white": openTab === 3 }
                            )}
                        >

                        CA Notice at Collection
                        </button> */}
                        <button
                            onClick={() => handleTabClick(4)}
                            className={classNames(
                                "flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-primary-100 transition-all duration-300",
                                { "bg-primary text-white": openTab === 4 }
                            )}
                        >
                            User Agreement
                        </button>
                        <button
                            onClick={() => handleTabClick(5)}
                            className={classNames(
                                "flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-primary-100 transition-all duration-300",
                                { "bg-primary text-white": openTab === 5 }
                            )}
                        >
                            About Us
                        </button>
                    </div>
                    <form onSubmit={submit} className="">
                        <div className={classNames("transition-all duration-300 bg-white p-4 rounded-lg shadow-md", {
                            "border-l-4 border-primary": openTab === 1, hidden: openTab !== 1
                        })}>
                            <h2 className="mb-2 text-2xl font-semibold text-primary">Terms of Service</h2>
                            <div className="sm:h-[500px] sm:py-[20px]">
                                <div className="h-[400px] sm:h-[400px] overflow-y-scroll mb-[50px] sm:mb-[50px]">
                                    <Quill
                                        theme="snow"
                                        modules={modules}
                                        value={data.terms_of_service}
                                        formats={formats}
                                        onChange={(e) => setData("terms_of_service", e)}
                                    />
                                </div>
                                <InputError message={errors.terms_of_service} className="mt-2" />
                            </div>
                        </div>
                        <div className={classNames("transition-all duration-300 bg-white p-4 rounded-lg shadow-md", {
                            "border-l-4 border-primary": openTab === 2, hidden: openTab !== 2
                        })}>
                            <h2 className="mb-2 text-2xl font-semibold text-primary">Privacy Policy</h2>
                            <div className="sm:h-[500px] sm:py-[20px]">
                                <div className="h-[400px] sm:h-[400px] overflow-y-scroll text-black mb-[50px] sm:mb-[50px]">
                                    <Quill
                                        theme="snow"
                                        modules={modules}
                                        value={data.privacy_policy}
                                        formats={formats}
                                        onChange={(e) => setData("privacy_policy", e)}
                                    />
                                </div>
                                <InputError message={errors.privacy_policy} className="mt-2" />
                            </div>
                        </div>
                        {/* <div className={classNames("transition-all duration-300 bg-white p-4 rounded-lg shadow-md", {
                            "border-l-4 border-primary": openTab === 3, hidden: openTab !== 3
                        })}>
                            <h2 className="mb-2 text-2xl font-semibold text-primary">CA Notice at Collection</h2>
                            <div className="sm:h-[500px] sm:py-[20px]">
                                <div className="h-[400px] sm:h-[400px] overflow-y-scroll mb-[50px] sm:mb-[50px]">
                                    <Quill
                                        theme="snow"
                                        modules={modules}
                                        value={data.ca_notice_at_collection}
                                        formats={formats}
                                        onChange={(e) => setData("ca_notice_at_collection", e)}
                                    />
                                </div>
                                <InputError message={errors.ca_notice_at_collection} className="mt-2" />
                            </div>
                        </div> */}
                        <div className={classNames("transition-all duration-300 bg-white p-4 rounded-lg shadow-md", {
                            "border-l-4 border-primary": openTab === 4, hidden: openTab !== 4
                        })}>
                            <h2 className="mb-2 text-2xl font-semibold text-primary">User Agreement</h2>
                            <div className="sm:h-[500px] sm:py-[20px]">
                                <div className="h-[300px] sm:h-[400px] overflow-y-scroll mb-[50px] sm:mb-[50px]">
                                    <Quill
                                        theme="snow"
                                        modules={modules}
                                        value={data.user_agreement}
                                        formats={formats}
                                        onChange={(e) => setData("user_agreement", e)}
                                    />
                                </div>
                                <InputError message={errors.user_agreement} className="mt-2" />
                            </div>
                        </div>
                        <div className={classNames("transition-all duration-300 bg-white p-4 rounded-lg shadow-md", {
                            "border-l-4 border-primary": openTab === 5, hidden: openTab !== 5
                        })}>
                            <h2 className="mb-2 text-2xl font-semibold text-primary">About Us</h2>
                            <div className="sm:h-[500px] sm:py-[20px]">
                                <div className="h-[400px] sm:h-[400px] overflow-y-scroll mb-[50px] sm:mb-[50px]">
                                    <Quill
                                        theme="snow"
                                        modules={modules}
                                        value={data.about_us}
                                        formats={formats}
                                        className="text-black"
                                        onChange={(e) => setData("about_us", e)}
                                    />
                                </div>
                                <InputError message={errors.about_us} className="mt-2" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end w-full pt-3">
                            <PrimaryLink
                            className="pt-3 mr-2"
                             href={route("admin.dashboard")}>
                                Back
                            </PrimaryLink>
                            <div className="flex col-span-4 lg:col-span-3">
                                <PrimaryButton className="ml-auto" type="submit">Save & Submit</PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Authenticated>
    );
}
