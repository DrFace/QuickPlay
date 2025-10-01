import InputError from "@/Components/elements/inputs/InputError";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import RadioButton from "@/Components/elements/inputs/RadioButton";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import SelectMultiInput from "@/Components/elements/inputs/SelectMultiInput";
import TextInput from "@/Components/elements/inputs/TextInput";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import AiTipsComponent from "./Partials/AiTipsComponent";
import { Job, User } from "@/types";
import FileUpload from "@/Components/shared/partials/FileUpload";



export default function ClientJobCreate({
    jobPost,
    type,
    user,
    categories,
    skillsOptions,
}: {
    jobPost: Job;
    user: User;
    type: string;
    skillsOptions: { label: string; value: string }[];
    categories: { label: string; value: string }[];
}) {

    const [scope, setScope] = useState(jobPost?.scope_size ?? 'Large');
    const [duration, setDuration] = useState(jobPost?.scope_duration ?? 'More than 6 months');
    const [experience, setExperience] = useState(jobPost?.scope_experience ?? 'Entry');
    const [processing, setProcessing] = useState(false);
    const [draftProcessing, setDraftProcessing] = useState(false);

    const { data, setData, post, errors, reset } = useForm({
        title: jobPost?.title ?? '',
        category_id: jobPost?.category_id ?? '',
        skills: jobPost?.skills ?? [],
        scope_size: jobPost?.scope_size ?? scope,
        scope_duration: jobPost?.scope_duration ?? duration,
        scope_experience: jobPost?.scope_experience ?? experience,
        budget: jobPost?.budget ?? "",
        attachments: jobPost?.attachments ?? [],
        description: jobPost?.description ?? "",
    });

   // console.log("jobPost", jobPost);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        {
            setProcessing(true),
                post(route('client.job.update', jobPost.id),
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setProcessing(false);
                        },
                        onError: (e) => {
                          //  console.log(e);
                            setProcessing(false);
                        },
                    }
                )

        };
    };


    const handleScopeSizeChange = (value: string) => {
        return () => {
            setScope(value);
            setData("scope_size", value);
        };
    };

    const handleScopeDurationChange = (value: string) => {
        return () => {
            setDuration(value);
            setData("scope_duration", value);
        };
    }
    const handleScopeExperienceChange = (value: string) => {
        return () => {
            setExperience(value);
            setData("scope_experience", value);
        };
    }

    const setDescription = (value: string) => {
        setData("description", value);
    };



    const handleDraftSubmit = () => {

        setDraftProcessing(true);

        post(route('client.job.update-draft', jobPost.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDraftProcessing(false);
                },
                onError: () => {
                    setDraftProcessing(false);
                },
            }
        );


    };



    return (
        <>
            <AppLayout isClientHeader={false} isHeader={true} isFooter={false} >
                <Head title="Post a Job" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <form onSubmit={submit} className="container flex flex-col max-w-2xl gap-4 mt-8 text-center ">

                        <h1 className="w-full text-3xl font-semibold font-Inter">Post a Job</h1>
                        {/* Title */}
                        <div className="w-full border rounded-3xl ">
                            <div className="flex flex-col p-6 text-left bg-gray-200 rounded-t-3xl ">
                                <h2 className="text-xl font-semibold font-Inter">Title</h2>
                                <span className="text-sm font-normal text-textSecondary font-Inter ">This helps your job post stand out to the right candidates.</span>
                            </div>
                            <div className="flex flex-col items-start justify-start w-full p-6 text-left ">
                                <div className="w-full">
                                    <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="title " value="Write a title for your job post" />
                                    <TextInput
                                        id="title"
                                        type="title"
                                        placeholder='Enter job title'
                                        name="title"
                                        isFocused={true}
                                        value={data.title}
                                        className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    <InputError message={errors.title} className="mt-2" />

                                    <div className="w-full gap-4 mt-4">
                                        <h3 className="text-sm font-medium font-Inter">Example title</h3>
                                        <ul className="px-2 py-4 list-disc list-inside">
                                            <li className="text-xs font-normal sm:text-sm font-Inter">Looking for a full-stack developer for a 6-month contract</li>
                                            <li className="text-xs font-normal sm:text-sm font-Inter">Need a graphic designer for a one-time project</li>
                                            <li className="text-xs font-normal sm:text-sm font-Inter">Hiring a marketing manager for a remote position</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="category_id" value="Job category" />
                                    <p className="mt-1 text-sm font-normal text-textSecondary font-Inter ">Let’s categorize your job, which helps us personalize your job details and match your job to relevant freelancers.</p>
                                    <SelectInput
                                        className="block w-full mt-2 placeholder:text-sm font-Inter"
                                        options={categories}
                                        placeholder="Select a category"
                                        selectedOption={categories.filter(
                                            (obj: any) => {
                                                return obj.value === data.category_id;
                                            }
                                        )}
                                        setData={(e: any) => setData("category_id", e)}
                                    />
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>
                            </div>
                        </div>
                        {/* Skills */}
                        <div className="w-full border rounded-3xl ">
                            <div className="flex flex-col p-6 text-left bg-gray-200 rounded-t-3xl ">
                                <h2 className="text-xl font-semibold font-Inter">Skills</h2>
                                <span className="text-sm font-normal text-textSecondary font-Inter ">What are the main skills required for your work?</span>
                            </div>
                            <div className="flex flex-col items-start justify-start w-full p-6 text-left ">
                                <div className="w-full">
                                    <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="skills" value="Select skills needed for job" />
                                    <SelectMultiInput
                                        className="block w-full mt-2 placeholder:text-sm font-Inter"
                                        options={skillsOptions}
                                        placeholder="Select skills"
                                        //disabled={jobPost.status === 'active'}
                                        selectedOption={skillsOptions?.filter(
                                            (obj: any) => {
                                                return data?.skills?.includes(
                                                    obj.value
                                                );
                                            }
                                        )}
                                        setData={(e: any) => setData("skills", e)}
                                    />
                                    <InputError message={errors.skills} className="mt-2" />
                                    <p className="mt-1 text-sm font-normal text-textSecondary font-Inter ">For the best results, add 3-5 skills</p>
                                </div>
                            </div>
                        </div>
                        {/* Scope */}
                        <div className="w-full border rounded-3xl">
                            <div className="flex flex-col p-6 text-left bg-gray-200 rounded-t-3xl">
                                <h2 className="text-xl font-semibold font-Inter">Scope</h2>
                                <span className="text-sm font-normal text-textSecondary font-Inter">Consider the size of your project and time it will take.</span>

                            </div>
                            <div className="flex flex-col items-start justify-start w-full p-6 text-left">
                                {/* Scope Options */}
                                <div className="space-y-2">
                                    <InputError message={errors.scope_size} className="mt-2" />

                                    <RadioButton
                                        label="Large"
                                        value="Large"
                                        selectedValue={scope}
                                        onChange={handleScopeSizeChange("Large")}
                                    />
                                    <span className="text-sm font-normal sm:ml-7 text-textSecondary">Longer term or complex initiatives (ex. design and build a full website)</span>

                                    <RadioButton
                                        label="Medium"
                                        value="Medium"
                                        selectedValue={scope}
                                        onChange={handleScopeSizeChange("Medium")}
                                    />
                                    <span className="text-sm font-normal sm:ml-7 text-textSecondary">Well-defined projects (ex. a landing page)</span>

                                    <RadioButton
                                        label="Small"
                                        value="Small"
                                        selectedValue={scope}
                                        onChange={handleScopeSizeChange("Small")}
                                    />
                                    <span className="text-sm font-normal sm:ml-7 text-textSecondary">Quick and straightforward tasks (ex. update text and images on a webpage)</span>
                                </div>
                                {/* Duration Options */}
                                <div className="mt-4 space-y-2">
                                    <h3 className="mb-2 text-lg font-semibold font-Inter">How long will your work take?</h3>
                                    <InputError message={errors.scope_duration} className="mt-2" />

                                    {scope === "Large" && (
                                        <>
                                            <RadioButton
                                                label="More than 6 months"
                                                value="More than 6 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("More than 6 months")}
                                            />
                                            <RadioButton
                                                label="3 to 6 months"
                                                value="3 to 6 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("3 to 6 months")}
                                            />
                                            <RadioButton
                                                label="1 to 3 months"
                                                value="1 to 3 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("1 to 3 months")}
                                            />
                                        </>
                                    )}
                                    {scope === "Medium" && (
                                        <>
                                            <RadioButton
                                                label="More than 6 months"
                                                value="More than 6 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("More than 6 months")}
                                            />
                                            <RadioButton
                                                label="3 to 6 months"
                                                value="3 to 6 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("3 to 6 months")}
                                            />
                                            <RadioButton
                                                label="1 to 3 months"
                                                value="1 to 3 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("1 to 3 months")}
                                            />
                                        </>
                                    )}
                                    {scope === "Small" && (
                                        <>
                                            <RadioButton
                                                label="3 to 6 months"
                                                value="3 to 6 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("3 to 6 months")}
                                            />
                                            <RadioButton
                                                label="1 to 3 months"
                                                value="1 to 3 months"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("1 to 3 months")}
                                            />
                                            <RadioButton
                                                label="Less than 1 month"
                                                value="Less than 1 month"
                                                selectedValue={duration}
                                                onChange={handleScopeDurationChange("Less than 1 month")}
                                            />
                                        </>
                                    )}
                                </div>
                                {/* Experience Options */}
                                <div className="mt-4 space-y-2">
                                    <h3 className="mb-2 text-lg font-semibold font-Inter">What level of experience will it need?</h3>
                                    <InputError message={errors.scope_experience} className="mt-2" />

                                    <RadioButton
                                        label="Entry"
                                        value="Entry"
                                        selectedValue={experience}
                                        onChange={handleScopeExperienceChange("Entry")}
                                    />
                                    <span className="text-sm font-normal sm:ml-7 text-textSecondary">Looking for someone relatively new to the field</span>

                                    <RadioButton
                                        label="Intermediate"
                                        value="Intermediate"
                                        selectedValue={experience}
                                        onChange={handleScopeExperienceChange("Intermediate")}
                                    />
                                    <span className="text-sm font-normal sm:ml-7 text-textSecondary">Looking for substantial experience in this field</span>

                                    <RadioButton
                                        label="Expert"
                                        value="Expert"
                                        selectedValue={experience}
                                        onChange={handleScopeExperienceChange("Expert")}
                                    />
                                    <span className="text-sm font-normal sm:ml-7 text-textSecondary">Looking for comprehensive and deep expertise in this field</span>
                                </div>
                            </div>
                        </div>
                        {/* Budget */}
                        <div className="w-full border rounded-3xl ">
                            <div className="flex flex-col p-6 text-left bg-gray-200 rounded-t-3xl ">
                                <h2 className="text-xl font-semibold font-Inter">Budget</h2>
                                <span className="text-sm font-normal text-textSecondary font-Inter ">This will help us match you to talent within your range.</span>
                            </div>
                            <div className="flex flex-col items-start justify-start w-full p-6 text-left ">
                                <div className="w-full">
                                    <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="budget" value="What is the best cost estimate for your project?" />
                                    <span className="text-sm font-normal text-textSecondary font-Inter ">You can negotiate this cost and create milestones when you chat with your freelancer</span>

                                    <div className="flex items-center w-full gap-2">
                                        <span className="text-lg font-normal text-textSecondary font-Inter">$</span>
                                        <TextInput
                                            id="budget"
                                            type="number"
                                            placeholder="Enter budget"
                                            name="budget"
                                            value={data.budget}
                                            className="block w-2/3 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (newValue.length <= 10) {
                                                    setData('budget', newValue); // Update state only if length is 10 or less
                                                }
                                            }}
                                            onWheel={(e) => e.currentTarget.blur()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                    e.preventDefault(); // Prevents entering non-numeric characters like 'e'
                                                }
                                            }}
                                            maxLength={10}
                                        />
                                    </div>


                                    <InputError message={errors.budget} className="mt-2" />

                                </div>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="w-full border rounded-3xl ">
                            <div className="flex flex-col p-6 text-left bg-gray-200 rounded-t-3xl ">
                                <h2 className="text-xl font-semibold font-Inter">Description</h2>
                                <span className="text-sm font-normal text-textSecondary font-Inter ">This will help us match you to talent within your range.</span>
                            </div>
                            <div className="flex flex-col items-start justify-start w-full p-6 text-left ">
                                <div className="w-full">
                                    <div className="w-full gap-4 mt-4">
                                        <h3 className="text-base font-medium font-Inter">Talent are looking for:</h3>
                                        <ul className="px-2 py-4 list-disc list-inside">
                                            <li className="text-xs font-normal sm:text-sm font-Inter">Clear expectations about your tasks or deliverables</li>
                                            <li className="text-xs font-normal sm:text-sm font-Inter">Details about how you or your team like to work</li>
                                            <li className="text-xs font-normal sm:text-sm font-Inter">The skills required for your work</li>
                                            <li className="text-xs font-normal sm:text-sm font-Inter">Good communication</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <AiTipsComponent
                                        setDescription={setDescription}
                                        descriptionText={data.description}
                                    />
                                    <InputError message={errors.description} className="mt-0" />
                                </div>
                                <div className="w-full mt-4">
                                    <h2 className="text-lg font-bold text-black font-Inter" >Additional project files</h2>
                                    <FileUpload
                                        setData={setData}
                                        attachmentFilePath={data?.attachments}
                                        type={type}
                                    />

                                    <span className="text-xs font-normal text-textSecondary font-Inter">Max file size: 100 MB</span>
                                    <InputError message={errors.attachments} className="mt-2" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end w-full gap-4 ">
                            {jobPost.status === 'draft' &&
                                <button
                                    type="button"
                                    onClick={handleDraftSubmit}
                                    className="flex items-center justify-center w-auto px-8 py-2 mt-4 font-medium border-2 rounded-full text-primary border-primary hover:bg-primary hover:text-white"
                                >
                                    {draftProcessing ? 'Saving...' : 'Save as draft'}
                                </button>
                            }
                            <button
                                type="submit"
                                className="flex items-center justify-center w-auto px-8 py-2 mt-4 font-medium text-white rounded-full bg-primary hover:bg-primaryBtnColorHover"
                                disabled={processing}
                            >
                                {processing ? 'Processing...' : type === 'edit' ? 'Update this job' : 'Post this job'}
                            </button>
                        </div>
                    </form>
                </section>
            </AppLayout>


        </>
    );
}
