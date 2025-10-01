import React, { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { User } from '@/types';
import SelectInput from '@/Components/elements/inputs/SelectInput';
import JobCategoryModal from './JobCategoryModal';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function ProfileSettings(
    {
        user,
        jobCategories,
        skillsOptions,
        jobSkills
    }: {
        user: User,
        jobCategories: { label: string; value: string }[],
        skillsOptions: { label: string; value: string }[],
        jobSkills: any
    }) {

    const [showJobCategoryModal, setShowJobCategoryModal] = useState(false);

    const handleCloseModal = () => {
        setShowJobCategoryModal(false);
    };


    const { data, setData, post } = useForm({
        visibility: user?.meta_data?.visibility || '',
        project_preference: user?.meta_data?.project_preference || '',
        experience_level: user?.meta_data?.experience_level || 'none',
    });

    const visibilityOptions = [
        { label: "Only Ai-Geeks users", value: "Only Ai-Geeks users" },
        // { label: "Public", value: "public" },
        { label: "Only for me", value: "Only for me" },
    ];

    const projectPreferenceOptions = [
        { label: "Long term projects", value: "Long term projects" },
        { label: "Short term projects", value: "Short term projects" },
        { label: "Both long term and short term projects", value: "Both long term and short term projects" },
    ];

    // Effect to handle visibility changes
    useEffect(() => {
        if (data.visibility !== user?.meta_data?.visibility && data.visibility !== '') {
            post(route('freelancer.account.updateProfileVisibilityInfo'), {
                preserveScroll: true,
                onSuccess: () => {
                   // console.log('Visibility updated successfully.');
                },
            });
        }
    }, [data.visibility]);

    // Effect to handle project preference changes
    useEffect(() => {
        if (data.project_preference !== user?.meta_data?.project_preference && data.project_preference !== '') {
            post(route('freelancer.account.updateProfileInfo'), {
                preserveScroll: true,
                onSuccess: () => {
                   // console.log('Project preference updated successfully.');
                },
            });
        }
    }, [data.project_preference]);

    // Effect to handle experience level changes
    useEffect(() => {
        if (data.experience_level !== user?.meta_data?.experience_level && data.experience_level !== 'none') {
            post(route('freelancer.account.updateProfileExperienceInfo'), {
                preserveScroll: true,
                onSuccess: () => {
                   // console.log('Experience level updated successfully.');
                },
            });
        }
    }, [data.experience_level]);

    const handleSelectChange = (field: 'visibility' | 'project_preference', value: string) => {
        setData(field, value);
    };

    const handleExperienceChange = (value: string) => {
        setData('experience_level', value);
    };

    return (
        <div className="flex flex-col w-full gap-6 bg-white">
            {/* Profile Section */}
            <div className="flex flex-col gap-4 p-6 border border-gray-300 rounded-2xl">
                <div className="text-2xl font-medium leading-7 text-black">My Profile</div>
                <div className="flex flex-col gap-4">
                    {/* Visibility */}
                    <div className="flex flex-col gap-3">
                        <div className="text-sm font-semibold leading-4 text-black font-Inter">Visibility</div>
                        <SelectInput
                            options={visibilityOptions}
                            selectedOption={visibilityOptions.find(option => option.value === data.visibility)}
                            setData={(value: string) => handleSelectChange('visibility', value)}
                        />
                    </div>
                    {/* Project Preference */}
                    <div className="flex flex-col gap-3">
                        <div className="text-sm font-semibold leading-4 text-black font-Inter">Project Preference</div>
                        <SelectInput
                            options={projectPreferenceOptions}
                            selectedOption={projectPreferenceOptions.find(option => option.value === data.project_preference)}
                            setData={(value: string) => handleSelectChange('project_preference', value)}
                        />
                    </div>
                </div>
            </div>

            {/* Experience Level Section */}
            <div className="flex flex-col gap-6 p-6 border border-gray-300 rounded-2xl">
                <div className="text-2xl font-medium leading-7 text-black font-Inter">Experience Level</div>
                <div className="flex flex-wrap gap-4">
                    {['none', 'entry', 'intermediate', 'expert'].map(level => (level === 'none' ? null : (
                        <div
                            key={level}
                            className={`flex flex-col gap-4 p-4 rounded-lg border ${data.experience_level === level ? 'border-blue-800' : 'border-gray-300'
                                } flex-1 cursor-pointer`}
                            onClick={() => handleExperienceChange(level)}
                        >
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-black capitalize font-Inter">{level} Level</span>
                                <input
                                    type="radio"
                                    className="text-blue-800 form-radio"
                                    name="experience"
                                    value={level}
                                    checked={data.experience_level === level}
                                    onChange={() => handleExperienceChange(level)}
                                />
                            </label>
                            <span className="text-xs text-gray-600 font-Inter">
                                {level === 'entry' && 'I am relatively new to this field'}
                                {level === 'intermediate' && 'I have substantial experience in this field'}
                                {level === 'expert' && 'I have comprehensive and deep expertise in this field'}
                            </span>
                        </div>
                    )
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className="flex flex-col gap-6 p-6 border border-gray-300 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-medium leading-7 text-black font-Inter">Job Categories</div>
                    <button
                        className="flex items-center justify-center w-6 h-6 bg-white border border-blue-600 rounded-full"
                        onClick={() => setShowJobCategoryModal(true)}
                    >
                        <img
                            className="w-4 h-4"
                            src="/assets/Icons/freelancer/account/Union.png"
                            alt="edit icon"
                        />
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {jobSkills && jobSkills.length > 0 ? (
                        jobSkills.map((jobSkill: any, index: number) => {
                            return (
                                <div key={index} className="flex flex-col gap-4">

                                        <div className="flex items-center justify-between">
                                            <div className="text-xl font-medium text-black">{jobSkill?.category_name}</div>
                                            <Link
                                                href={route('freelancer.account.deleteJobCategoryInfo', jobSkill?.id)}
                                                className="flex items-center justify-center w-5 h-5 p-1 text-center bg-white rounded-full ring-primary ring-2">
                                                <TrashIcon className="w-4 h-4 text-primary" />
                                            </Link>
                                        </div>
                                    {/* Display Skills */}
                                    <div className="flex flex-row gap-3">
                                        {jobSkill?.skills?.length > 0 ? (
                                            jobSkill?.skills?.map((skill: string, skillIndex: number) => (
                                                <p key={skillIndex} className="px-3 py-2 text-sm font-medium capitalize bg-gray-300 text-textSecondary rounded-3xl text-start font-Inter">
                                                    {skill}
                                                </p>
                                            ))
                                        ) : (
                                            <p>No skills available</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No job categories or skills available</p>
                    )}
                </div>
{showJobCategoryModal &&
                <JobCategoryModal

                    jobCategories={jobCategories}
                    skillsOptions={skillsOptions}
                    show={showJobCategoryModal}
                    onClose={handleCloseModal}
                />
}
            </div>

        </div>
    );
}
