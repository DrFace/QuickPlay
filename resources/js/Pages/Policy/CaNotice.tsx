import { Head } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import "react-quill/dist/quill.snow.css";



export default function caNotice({ notices }: { notices: any }) {
    return (
        <AppLayout>
            <Head title="Return Policy" />
            <div className="px-10 pt-20 bg-white sm:px-0">
                <div className="container min-h-screen mx-auto mt-20 bg-white ">
                    <div className="px-4 py-2 sm:px-0">
                        <div className="">
                            <h1 className="px-4 mb-2 text-4xl font-bold tracking-tight text-gray-800 sm:px-0 sm:text-5xl ">
                                CA Notice
                            </h1>
                            <hr className="mx-4 my-4 sm:mx-0" />
                        </div>
                        <div className=" max-w-7xl">
                            {/* Render the rest of your content here */}
                            <div
                                className="text-black ql-editor"
                                dangerouslySetInnerHTML={{ __html: notices?.content }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
