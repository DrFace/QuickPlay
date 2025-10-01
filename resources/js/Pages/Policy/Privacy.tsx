import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import "react-quill/dist/quill.snow.css";

export default function privacy({ privacies }: { privacies: any }) {

    return (
        <>
            <AppLayout>
                <Head title="Terms" />
                <section className="pt-20 bg-client-home-pattern ">
                    <div className="container px-5 mx-auto mt-20 bg-transparent lg:min-h-screen ">
                        <div className="py-10 ">
                            <div className="px-3 py-4">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
                                    Privacy Policy
                                </h1>
                            </div>
                            <div className=" max-w-7xl">
                                {/* Render the rest of your content here */}
                                <div
                                    className="text-black ql-editor "
                                    dangerouslySetInnerHTML={{ __html: privacies?.content }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
