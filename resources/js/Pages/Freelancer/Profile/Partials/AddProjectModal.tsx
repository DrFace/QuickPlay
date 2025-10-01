import InputError from '@/Components/elements/inputs/InputError';
import InputLabel from '@/Components/elements/inputs/InputLabel';
import TextArea from '@/Components/elements/inputs/TextArea';
import TextInput from '@/Components/elements/inputs/TextInput';
import { useForm } from '@inertiajs/react';
import React, { FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const AddProjectModal = (
    {
        portfolio,
        onClose,
        type,
        Published,
    }: {
        portfolio: any,
        onClose: () => void
        type: any,
        Published: boolean
    }) => {
    const [processing, setProcessing] = useState(false);
    const [draftProcessing, setDraftProcessing] = useState(false);

    const { data, setData, post, errors, progress, reset } = useForm({
        title: portfolio?.title ?? '',
        role: portfolio?.role ?? '',
        skills: portfolio?.skills ?? '',
        image: portfolio?.image ?? '',
        description: portfolio?.description ?? "",
    });

    const [canCleanImage, setCanCleanImage] = useState(false);
    const [images, setImages] = useState([]);
    const remove = (file: any) => {
        const newImages = [...images];
        newImages.splice(file, 1);
        setImages([]);
        setData('image', newImages[0]);
        setCanCleanImage(false);
    };
    const onDrop = useCallback(
        (acceptedFiles: any) => {
            setImages(
                acceptedFiles?.map((file: any) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
            setCanCleanImage(true);
            setData(
                "image",
                acceptedFiles?.map((file: any) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )[0]
            );
        },
        [setImages, setData]
    );
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    });
    const thumb = images?.map((file: any) => (
        <div key={file.name}>
            <div>
                <img
                    alt={file.name}
                    src={file.preview}
                    width={300}
                    height={300}
                    className="h-[200px] w-full overflow-hidden object-contain rounded-xl bg-gray-700"
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                    }}
                />
            </div>
        </div>
    ));



    useEffect(() => {
        return () =>
            images.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, [images]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        {
            setProcessing(true);
            {type === 'create' ?

                post(route('freelancer.portfolio.store'),
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setProcessing(false);
                            onClose();
                        },
                        onError: (e) => {
                          //  console.log(e);
                            setProcessing(false);
                        },
                    }
                )
                : Published ?

                    post(route('freelancer.portfolio.update', { id: portfolio.id }),
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setProcessing(false);
                                onClose();
                            },
                            onError: (e) => {
                              //  console.log(e);
                                setProcessing(false);
                            },
                        }
                    )
                    :
                  post(route('freelancer.portfolio.update-draft', { id: portfolio.id }),
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setProcessing(false);
                                onClose();
                            },
                            onError: (e) => {
                              //  console.log(e);
                                setProcessing(false);
                            },
                        }
                    )
                }

        };
    };

    const handleDraftSubmit = () => {
        setDraftProcessing(true);

        post(route('freelancer.portfolio.store-draft'),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDraftProcessing(false);
                    onClose();
                },
                onError: () => {
                    setDraftProcessing(false);
                },
            }
        )
    };

    const handlePublishSubmit = () => {
        setDraftProcessing(true);
        post(route('freelancer.portfolio.publish', { id: portfolio.id }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDraftProcessing(false);
                    onClose();
                },
                onError: () => {
                    setDraftProcessing(false);
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
            <div className="w-5/6 p-6 mt-40 bg-white rounded-lg sm:mt-0 md:w-2/3 lg:w-1/2">
                <div className="flex justify-between">
                    <h2 className="mb-2 text-2xl font-semibold sm:py-3 ">Add a new portfolio project</h2>
                    <button onClick={onClose} className="text-lg text-gray-500 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={submit} className='flex flex-col gap-2'>
                    <div className="w-full">
                        <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="title " value="Project title" />
                        <TextInput
                            id="title"
                            type="title"
                            placeholder='Enter a brief but descriptive title'
                            name="title"
                            isFocused={true}
                            value={data.title}
                            className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div className="flex flex-col w-full gap-4 sm:flex-row">
                        <div className='flex flex-col w-full gap-2 sm:w-1/2'>
                            <div className="w-full">
                                <InputLabel  className="text-base font-bold text-black font-Inter" htmlFor="role" value="Your role (Optional)" />
                                <TextInput
                                    id="role"
                                    type="role"
                                    placeholder='eg: Front-end engineer'
                                    name="role"

                                    value={data.role}
                                    className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                                    onChange={(e) => setData('role', e.target.value)}
                                />
                                <InputError message={errors.role} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel
                                    required
                                    htmlFor="description"
                                    value="Project description"
                                />

                                <TextArea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    placeholder='Briefly describe the project’s goals. your solution and the impact you made.'
                                    className="block w-full mt-1 placeholder:text-xs"
                                    maxLength={500}
                                    rows={4}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                  <span className="text-xs text-gray-400 ">Max 500 characters</span>

                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>
                            <div className="w-full">
                                <InputLabel required className="text-base font-bold text-black font-Inter" htmlFor="skills" value="Skills and deliverables" />
                                <TextInput
                                    id="skills"
                                    type="skills"
                                    placeholder='Type to add skills relevant to this project'
                                    name="skills"

                                    value={data.skills}
                                    className="block w-full h-10 p-2 mt-2 border rounded-xl placeholder:text-xs font-Inter"
                                    onChange={(e) => setData('skills', e.target.value)}
                                />
                                <InputError message={errors.skills} className="mt-2" />
                            </div>
                        </div>

                        <div className='flex flex-col items-center justify-center w-full sm:w-1/2'>
                            {/* Image */}


                            <div className="grid justify-center grid-flow-row px-6 py-2 mt-2 border-2 border-dashed rounded-xl ">

                            <InputLabel required={type === 'create' ? true : false} className="text-base font-bold text-black font-Inter" htmlFor="image" value="Image" />
                            <span className="text-xs text-gray-400">Recommended size: 800x600px</span>
                                <div className="relative flex items-center h-full ">
                                    <div
                                        {...getRootProps({
                                            className: "dropzone",
                                        })}
                                        className="sm:min-h-[200px] min-h-[80px] object-cover h-full w-full cursor-pointer flex rounded-xl bg-slate-200"
                                    >
                                        <input
                                            type="file"
                                            {...getInputProps()}
                                        />
                                        {images?.length > 0 ? (
                                            thumb
                                        ) : portfolio?.image ? (
                                            <img
                                                src={portfolio?.image_url ?? ""}
                                                alt={portfolio?.name ?? ""}
                                                className="h-[200px] w-full flex overflow-hidden  rounded-xl bg-gray-50"
                                            />
                                        ) : (
                                            <span className="absolute grid self-center mx-auto text-center text-gray-900 left-4 right-4">
                                                Upload Image
                                            </span>
                                        )}
                                    </div>

                                    {progress && (
                                        <progress
                                            value={progress?.percentage}
                                            className="absolute top-0 left-0 h-2 bg-emerald-500"
                                            max="100"
                                        >
                                            {progress?.percentage}%
                                        </progress>
                                    )}
                                </div>
                                {canCleanImage && (
                                    <button
                                        className="z-10 mx-auto mt-2 w-[70px] rounded bg-gray-300 py-1 px-2 text-sm text-gray-700 hover:bg-gray-500 hover:text-gray-900"
                                        type="button"
                                        onClick={() => remove(0)}
                                    >
                                        Clean
                                    </button>
                                )}
                                {canCleanImage ? null : (
                                    <div className="mt-1 ml-3 text-xs font-light text-center text-gray-500">
                                        {" "}
                                        Drag and drop or click to replace
                                    </div>
                                )}
                                <div className="mt-1 text-center">
                                <InputError message={errors?.image} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 sm:justify-end sm:mt-10 sm:flex-row">
                        {(type === 'create') ?
                        <button
                            type="button"
                            className="px-8 py-1 border sm:mr-4 hover:text-white rounded-3xl border-primaryBtnColor hover:bg-primaryBtnColorHover"
                            onClick={handleDraftSubmit}
                        >

                          {draftProcessing ?  'Saving...' : 'Save as draft'}
                        </button>
                        : !Published ?

                        <button
                            type="button"
                            className="px-8 py-1 mr-4 border hover:text-white rounded-3xl border-primaryBtnColor hover:bg-primaryBtnColorHover"
                            onClick={handlePublishSubmit}
                        >

                          {draftProcessing ?  'Publishing...' : 'Publish'}
                        </button>
                        : null}
                        <button
                            type="submit"
                            className="px-10 py-1 text-white border bg-primaryBtnColor border-primaryBtnColor hover:bg-primaryBtnColorHover rounded-3xl"
                        >

                            {processing ?  type === 'create' ? 'Creating...' : 'Updating...' :  type === 'create' ? 'Create' : 'Update'}
                        </button>


                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectModal;
