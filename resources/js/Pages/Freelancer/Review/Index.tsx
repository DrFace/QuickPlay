import InputError from "@/Components/elements/inputs/InputError";
import InputLabel from "@/Components/elements/inputs/InputLabel";
import SelectInput from "@/Components/elements/inputs/SelectInput";
import TextArea from "@/Components/elements/inputs/TextArea";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import RadioButton from "@/Components/elements/inputs/RadioButton";
import { Rating } from "react-simple-star-rating";
import { fillColorArray } from "@/lib/fillColorArray";


export default function OfferReview({
    offer,
    user,
}: {
    offer: any;
    user: any;
}) {

    const [EnglishProficiency, setEnglishProficiency] = useState(offer?.english_proficiency ?? 'Acceptable');
    const [TotalRateAvg, setTotalRateAvg] = useState(0);

    const { data, setData, post, errors, progress, reset } = useForm({
        recommend_rate: offer?.recommend_rate ?? 0,
        feedback: offer?.feedback ?? '',
        contract_end_reason: offer?.contract_end_reason ?? '',
        english_proficiency: offer?.english_proficiency ?? 'Acceptable',
        skills_rate: offer?.skills_rate ?? 0,
        quality_rate: offer?.quality_rate ?? 0,
        availability_rate: offer?.availability_rate ?? 0,
        adherence_rate: offer?.adherence_rate ?? 0,
        communication_rate: offer?.communication_rate ?? 0,
        cooperation_rate: offer?.cooperation_rate ?? 0,
        avg_score_rate: offer?.avg_score_rate ?? 0,
        your_experience: offer?.your_experience ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('freelancer.contracts.review-submit', offer?.id),
            {
                preserveScroll: true,
                onSuccess: () => {

                },
                onError: (e) => {

                },
            }
        )

    };

    const reasons = [
        {
            value: 'project_completed_successfully',
            label: 'Project completed successfully'
        },
        {
            value: 'problem_working_with_client',
            label: 'Problem working with client'
        },
        {
            value: 'budget_or_pricing_concerns',
            label: 'Budget or pricing concerns'
        },
        {
            value: 'contract_no_longer_needed',
            label: 'Contract is no longer needed'
        },
        {
            value: 'client_no_longer_available',
            label: 'Client is no longer available'
        },
        {
            value: 'changes_ti_this_contract_are_needed',
            label: 'Changes to this contract are needed'
        },
    ];



    const handleEnglishProficiencyChange = (value: string) => {
        return () => {
            setEnglishProficiency(value);
            setData("english_proficiency", value);
        };
    }

    const handleSkillRating = (rate: number) => {
        setData("skills_rate", rate);
    };
    const handleQualityRating = (rate: number) => {
        setData("quality_rate", rate);
    };
    const handleAvailabilityRating = (rate: number) => {
        setData("availability_rate", rate);
    };
    const handleAdherenceRating = (rate: number) => {
        setData("adherence_rate", rate);
    };
    const handleCommunicationRate = (rate: number) => {
        setData("communication_rate", rate);
    };
    const handleCooperationRating = (rate: number) => {
        setData("cooperation_rate", rate);
    };

    useEffect(() => {
        let totalRate = 0;
        totalRate += data.skills_rate;
        totalRate += data.quality_rate;
        totalRate += data.availability_rate;
        totalRate += data.adherence_rate;
        totalRate += data.communication_rate;
        totalRate += data.cooperation_rate;
        setTotalRateAvg(totalRate / 6);
        setData("avg_score_rate", totalRate / 6);
    }, [data.skills_rate, data.quality_rate, data.availability_rate, data.adherence_rate, data.communication_rate, data.cooperation_rate]);


    const handleRatingClick = (rating: number) => {
        setData('recommend_rate', rating);
    };

   // console.log(offer);

    return (
        <>
            <AppLayout isFreelancerHeader={true} isHeader={false}>
                <Head title="Review" />
                <section className="flex justify-center min-h-screen px-4 py-20 mt-20 bg-white sm:px-6 lg:px-8 ">
                    <form onSubmit={submit} className="container flex flex-col gap-4 mx-auto mt-8 text-center ">
                        <h1 className="text-2xl font-bold first-letter:capitalize text-start font-Inter ">End Contract</h1>

                        <div className="flex flex-row gap-4 ">
                            <div className="flex flex-col w-full gap-4 lg:w-3/4">
                                <div className="flex flex-col gap-4 ">
                                    <h1 className="text-lg font-bold first-letter:capitalize text-start font-Inter">Private feedback</h1>
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-4">
                                            <p className="text-left">This is your opportunity to share feedback on {offer?.user?.first_name} that you don’t want posted publicly. We’ll use it to improve the user experience, but we won’t share it with {offer?.user?.first_name}.</p>
                                            <div className="flex flex-col justify-start w-3/4 gap-3 text-left">
                                                <div className="flex flex-row gap-2">
                                                    <InputLabel required htmlFor="recommend_rate" value="How likely are you to recommend this client to a friend or a colleague ?" />
                                                </div>
                                                <div className="flex flex-row justify-center gap-2">
                                                    {[...Array(6).keys()].map((rating) => (
                                                        <button
                                                            type="button"
                                                            key={rating}
                                                            onClick={() => handleRatingClick(rating)}
                                                            className={`px-4 py-2.5 text-sm font-bold border-2 border-gray-400 rounded-full ${data.recommend_rate === rating ? 'bg-blue-600 text-white' : 'text-primary hover:bg-blue-600 hover:text-white'}`}
                                                        >
                                                            {rating}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex flex-row justify-between sm:mx-32">
                                                    <span className="text-sm font-bold text-gray-500">Not at all likely</span>
                                                    <span className="text-sm font-bold text-gray-500">Extremely likely</span>
                                                </div>
                                                <InputError message={errors.recommend_rate} className="mt-2" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col justify-start gap-6 text-left sm:w-3/4">
                                                <div className="flex flex-col gap-2 ">

                                                    <InputLabel required htmlFor="feedback" value="Do you have any feedback on the client ?" />
                                                    <div>

                                                        <TextArea
                                                            id="freelancer_feedback"
                                                            name="freelancer_feedback"
                                                            value={data?.feedback}
                                                            placeholder='Your feedback helps us make our platform better for everyone.'
                                                            className="block w-full mt-1 placeholder:text-xs"
                                                            isFocused={false}
                                                            rows={4}
                                                            onChange={(e) =>
                                                                setData("feedback", e.target.value)
                                                            }
                                                        />
                                                        <InputError
                                                            message={errors?.feedback}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-500 text-end "
                                                    >5,000 characters only</span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="w-full">
                                                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="contract_end_reason" value="Can you tell us your primary reason for ending this contract?" />
                                                        <SelectInput
                                                            className="block w-full mt-2 placeholder:text-sm font-Inter"
                                                            options={reasons}
                                                            placeholder="Select a category"
                                                            selectedOption={reasons?.filter(
                                                                (obj: any) => {
                                                                    return obj.value === data?.contract_end_reason;
                                                                }
                                                            )}
                                                            setData={(e: any) => setData("contract_end_reason", e)}
                                                        />
                                                        <InputError message={errors?.contract_end_reason} className="mt-2" />
                                                    </div>

                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {/* Scope Options */}
                                                    <div className="space-y-4">
                                                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="english_proficiency" value="Rate their English proficiency " />
                                                        <InputError message={errors?.english_proficiency} className="mt-2" />
                                                        <RadioButton
                                                            label="Fluent"
                                                            value="Fluent"
                                                            labelClassName="w-20"
                                                            selectedValue={EnglishProficiency}
                                                            onChange={handleEnglishProficiencyChange("Fluent")}
                                                        />
                                                        <RadioButton
                                                            label="Acceptable"
                                                            value="Acceptable"
                                                            labelClassName="w-32"
                                                            selectedValue={EnglishProficiency}
                                                            onChange={handleEnglishProficiencyChange("Acceptable")}
                                                        />
                                                        <RadioButton
                                                            label="Difficult to understand"
                                                            value="Difficult to understand"
                                                            labelClassName="w-[210px]"
                                                            selectedValue={EnglishProficiency}
                                                            onChange={handleEnglishProficiencyChange("Difficult to understand")}
                                                        />
                                                        <RadioButton
                                                            label="I didn’t speak to this freelancer"
                                                            value="I didn’t speak to this freelancer"
                                                            labelClassName="sm:w-[265px]"
                                                            selectedValue={EnglishProficiency}
                                                            onChange={handleEnglishProficiencyChange("I didn’t speak to this freelancer")}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 ">
                                    <h1 className="text-lg font-bold first-letter:capitalize text-start font-Inter">Public feedback</h1>
                                    <InputLabel required className="text-lg font-bold first-letter:capitalize text-start font-Inter" htmlFor="skills_rate" value="Rate the freelancer's skills" />
                                    <InputError message={errors.skills_rate} className="mt-2 text-start" />
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-4">

                                            <div className="flex flex-col justify-start gap-3 text-left sm:w-3/4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row items-center justify-start gap-1 ">
                                                        <div className="flex mt-1 ">
                                                            <Rating
                                                                initialValue={data?.skills_rate}
                                                                onClick={handleSkillRating}
                                                                transition
                                                                allowFraction
                                                                //showTooltip
                                                                //tooltipArray={tooltipArray}
                                                                fillColorArray={fillColorArray}
                                                                iconsCount={5}
                                                                size={30}
                                                                emptyStyle={{ display: "flex" }}
                                                                fillStyle={{
                                                                    display: "-webkit-inline-box",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="mt-1.5 pl-5 text-base font-bold  text-start font-Inter ">
                                                            Skills
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-start gap-1 ">
                                                        <div className="flex mt-1 ">
                                                            <Rating
                                                                initialValue={data?.quality_rate}
                                                                onClick={handleQualityRating}
                                                                transition
                                                                allowFraction
                                                                // showTooltip
                                                                //tooltipArray={tooltipArray}
                                                                fillColorArray={fillColorArray}
                                                                iconsCount={5}
                                                                size={30}
                                                                emptyStyle={{ display: "flex" }}
                                                                fillStyle={{
                                                                    display: "-webkit-inline-box",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="mt-1.5 text-base font-bold pl-5 text-start font-Inter ">
                                                            Quality of Work
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-start gap-1 ">
                                                        <div className="flex mt-1 ">
                                                            <Rating
                                                                initialValue={data?.availability_rate}
                                                                onClick={handleAvailabilityRating}
                                                                transition
                                                                allowFraction
                                                                //showTooltip
                                                                //tooltipArray={tooltipArray}
                                                                fillColorArray={fillColorArray}
                                                                iconsCount={5}
                                                                size={30}
                                                                emptyStyle={{ display: "flex" }}
                                                                fillStyle={{
                                                                    display: "-webkit-inline-box",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="mt-1.5 text-base font-bold pl-5 text-start font-Inter ">
                                                            Availability
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-start gap-1 ">
                                                        <div className="flex mt-1 ">
                                                            <Rating
                                                                initialValue={data?.adherence_rate}
                                                                onClick={handleAdherenceRating}
                                                                transition
                                                                allowFraction
                                                                //showTooltip
                                                                //tooltipArray={tooltipArray}
                                                                fillColorArray={fillColorArray}
                                                                iconsCount={5}
                                                                size={30}
                                                                emptyStyle={{ display: "flex" }}
                                                                fillStyle={{
                                                                    display: "-webkit-inline-box",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="mt-1.5 text-base font-bold pl-5 text-start font-Inter ">
                                                            Adherence to Schedule
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-start gap-1 ">
                                                        <div className="flex mt-1 ">
                                                            <Rating
                                                                initialValue={data?.communication_rate}
                                                                onClick={handleCommunicationRate}
                                                                transition
                                                                allowFraction
                                                                //showTooltip
                                                                //tooltipArray={tooltipArray}
                                                                fillColorArray={fillColorArray}
                                                                iconsCount={5}
                                                                size={30}
                                                                emptyStyle={{ display: "flex" }}
                                                                fillStyle={{
                                                                    display: "-webkit-inline-box",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="mt-1.5 text-base font-bold pl-5 text-start font-Inter ">
                                                            Communication
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-row items-center justify-start gap-1 ">
                                                        <div className="flex mt-1 ">
                                                            <Rating
                                                                initialValue={data?.cooperation_rate}
                                                                onClick={handleCooperationRating}
                                                                transition
                                                                allowFraction
                                                                //showTooltip
                                                                //tooltipArray={tooltipArray}
                                                                fillColorArray={fillColorArray}
                                                                iconsCount={5}
                                                                size={30}
                                                                emptyStyle={{ display: "flex" }}
                                                                fillStyle={{
                                                                    display: "-webkit-inline-box",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="mt-1.5 text-base font-bold pl-5 text-start font-Inter ">
                                                            Cooperation
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xl font-bold ">Total Score : {(TotalRateAvg)?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col justify-start gap-6 text-left sm:w-3/4">
                                                    <div className="flex flex-col gap-2 ">

                                                        <InputLabel required htmlFor="your_experience" value="Share your experience with this client to the AI-Geeks community " />

                                                        <div>

                                                            <TextArea
                                                                id="your_experience"
                                                                name="your_experience"
                                                                value={data?.your_experience}
                                                                placeholder='Your comments will be shared publicly'
                                                                className="block w-full mt-1 placeholder:text-xs"
                                                                isFocused={false}
                                                                rows={4}
                                                                onChange={(e) =>
                                                                    setData("your_experience", e.target.value)
                                                                }
                                                            />
                                                            <InputError
                                                                message={errors?.your_experience}
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500 text-end "
                                                        >5,000 characters only</span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link
                                            // href={route('freelancer.contracts.show', offer?.id)}
                                            href=""
                                            className="px-6 py-2 border text-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColor hover:text-white rounded-3xl"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 text-white border bg-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColorHover rounded-3xl"
                                        >
                                            End Contract
                                        </button>

                                    </div>



                                </div>

                            </div>
                            <div className="flex-col hidden w-1/4 gap-4 pl-4 border-l-2 lg:flex">
                                <div className="flex flex-col w-full gap-8 p-8 border-2 border-gray-200 rounded-2xl">
                                    <div className="flex flex-col w-full gap-4">
                                        <div className="relative flex items-start ">
                                            <div className="absolute z-20 w-3 h-3 bg-green-400 rounded-full left- top-1 ring-2 ring-white"></div>
                                            <img
                                                className="w-16 h-16 rounded-full"
                                                src={offer?.user?.avatar}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between w-full gap-4 sm:items-center sm:flex-row">
                                            <div className="flex flex-col gap-2 text-start">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-medium text-blue-600 underline font-Inter "> {offer?.user?.full_name}</span>
                                                    <span className="text-sm font-normal text-textSecondary font-Inter">{offer?.user?.country}</span>
                                                    <span className="text-sm font-medium text-gray-500 font-Inter">{offer?.user?.user_country_time}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                    </form>
                </section>
            </AppLayout>
        </>
    );
}
