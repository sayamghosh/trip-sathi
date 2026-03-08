import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, UploadCloud, MapPin, Clock, Image as ImageIcon, X, Edit2 } from 'lucide-react';
import tourPlanService from '../../services/tourPlan.service';
import { getOptimizedImageUrl } from '../../lib/utils';
import toast from 'react-hot-toast';

const LOCAL_STORAGE_KEY = 'trip_sathi_tour_plan_draft';

const getInitialData = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved draft', e);
        }
    }
    return {
        title: '',
        description: '',
        basePrice: 0,
        durationDays: 1,
        durationNights: 0,
        locations: '', // comma separated string for ease of use
        bannerImages: [],
        days: [
            {
                dayNumber: 1,
                title: '',
                activities: []
            }
        ]
    };
};

export default function CreateTourPlanForm({ initialData, editId, onSuccess }: { initialData?: any, editId?: string, onSuccess?: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isDraggingBanner, setIsDraggingBanner] = useState(false);
    const [draggedBannerIndex, setDraggedBannerIndex] = useState<number | null>(null);

    const { register, control, handleSubmit, watch, reset, setValue } = useForm({
        defaultValues: initialData || getInitialData()
    });

    const bannerImages = watch('bannerImages') || [];

    useEffect(() => {
        if (editId) return; // Don't save draft when editing existing plan

        const subscription = watch((value) => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch, editId]);

    const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({
        control,
        name: 'days'
    });

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await tourPlanService.uploadImage(formData); // Will add this to authService or apiService
            return response.url;
        } catch (error) {
            console.error('Image upload failed', error);
            toast.error('Failed to upload image. Try again.');
            return null;
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploadingBanner(true);
            const url = await handleImageUpload(e.target.files[0]);
            if (url) {
                setValue('bannerImages', [...(watch('bannerImages') || []), url], { shouldDirty: true });
            }
            setIsUploadingBanner(false);
        }
    };

    const handleBannerDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingBanner(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setIsUploadingBanner(true);
            const url = await handleImageUpload(e.dataTransfer.files[0]);
            if (url) {
                setValue('bannerImages', [...(watch('bannerImages') || []), url], { shouldDirty: true });
            }
            setIsUploadingBanner(false);
        }
    };

    const handleBannerDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingBanner(true);
    };

    const handleBannerDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingBanner(false);
    };

    const handleBannerReorderStart = (index: number) => {
        setDraggedBannerIndex(index);
    };

    const handleBannerReorderDrop = (dropIndex: number) => {
        if (draggedBannerIndex === null || draggedBannerIndex === dropIndex) return;

        const currentImages = watch('bannerImages') || [];
        const newImages = [...currentImages];
        const [draggedImage] = newImages.splice(draggedBannerIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);

        setValue('bannerImages', newImages, { shouldDirty: true });
        setDraggedBannerIndex(null);
    };

    const handleBannerReorderDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        // Necessary to allow dropping
        e.preventDefault();
    };

    const removeBannerImage = (indexToRemove: number) => {
        const current = watch('bannerImages') || [];
        setValue('bannerImages', current.filter((_: any, i: number) => i !== indexToRemove), { shouldDirty: true });
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        // Parse locations
        const formattedData = {
            ...data,
            locations: data.locations.split(',').map((l: string) => l.trim()).filter(Boolean)
        };
        try {
            if (editId) {
                await tourPlanService.updateTourPlan(editId, formattedData);
                toast.success('Tour Plan Updated Successfully!');
            } else {
                await tourPlanService.createTourPlan(formattedData);
                toast.success('Tour Plan Created Successfully!');
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }

            if (onSuccess) {
                onSuccess();
            }

            if (!editId) {
                // reset form after success only in create mode
                reset({
                    title: '',
                    description: '',
                    basePrice: 0,
                    durationDays: 1,
                    durationNights: 0,
                    locations: '',
                    bannerImages: [],
                    days: [{ dayNumber: 1, title: '', activities: [] }]
                });
                setActiveDayIndex(0);
            }
            // optionally redirect
        } catch (error) {
            console.error(error);
            toast.error('Error creating plan');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddDay = () => {
        appendDay({ dayNumber: dayFields.length + 1, title: '', activities: [] });
        setActiveDayIndex(dayFields.length); // switch to the new day
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">General Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Tour Title</label>
                        <input {...register('title')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="e.g. Andaman with Freebies" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea {...register('description')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" rows={3}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Base Price (₹/Adult)</label>
                        <input type="number" {...register('basePrice')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Covered Locations (comma-separated)</label>
                        <input {...register('locations')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Port Blair, Havelock, Neil Island" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Days</label>
                        <input type="number" {...register('durationDays')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Nights</label>
                        <input type="number" {...register('durationNights')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                    </div>
                    <div className="md:col-span-2 mt-4 border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Banner Images (Shown on Landing Page Packages)</label>
                        <div className="flex gap-3 flex-wrap">
                            {bannerImages.map((img: string, i: number) => (
                                <div
                                    key={i}
                                    className="relative w-24 h-24 rounded-xl overflow-hidden border shadow-sm group bg-gray-100 cursor-move"
                                    draggable
                                    onDragStart={() => handleBannerReorderStart(i)}
                                    onDragOver={handleBannerReorderDragOver}
                                    onDrop={() => handleBannerReorderDrop(i)}
                                >
                                    <img src={getOptimizedImageUrl(img, 96)} alt="Banner" className="w-full h-full object-cover select-none pointer-events-none" width={96} height={96} loading="lazy" decoding="async" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeBannerImage(i);
                                        }}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-500 z-10"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {isUploadingBanner && (
                                <div className="w-24 h-24 border-2 border-gray-200 bg-gray-50 rounded-xl flex items-center justify-center shadow-inner">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                            <label
                                className={`w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${isDraggingBanner ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-500 bg-gray-50'}`}
                                onDrop={handleBannerDrop}
                                onDragOver={handleBannerDragOver}
                                onDragLeave={handleBannerDragLeave}
                            >
                                <UploadCloud size={24} className="mb-1" />
                                <span className="text-xs font-medium">Upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Upload beautiful high-quality images to attract travelers from the main landing page.</p>
                    </div>
                </div>
            </div>

            {/* Day Wise Itinerary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Day-wise Itinerary</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage activities for each day of the tour.</p>
                    </div>
                    {editId && (
                        <div className="text-right">
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-100 italic">
                                Editing Existing Plan
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row min-h-[500px]">
                    {/* Sidebar for Days */}
                    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-2">
                        {dayFields.map((day, index) => (
                            <button
                                key={day.id}
                                type="button"
                                onClick={() => setActiveDayIndex(index)}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center group
                                    ${activeDayIndex === index
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                            >
                                <span className="truncate pr-2">
                                    Day {index + 1}
                                    <span className={`block text-xs mt-0.5 truncate ${activeDayIndex === index ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {watch(`days.${index}.title`) || 'Untitled Day'}
                                    </span>
                                </span>
                                {dayFields.length > 1 && (
                                    <Trash2
                                        size={16}
                                        className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${activeDayIndex === index ? 'text-blue-200 hover:text-white' : 'text-gray-400 hover:text-red-500'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeDay(index);
                                            if (activeDayIndex >= index && activeDayIndex > 0) {
                                                setActiveDayIndex(activeDayIndex - 1);
                                            }
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddDay}
                            className="w-full mt-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-medium hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 bg-white"
                        >
                            <Plus size={18} /> Add Day
                        </button>
                    </div>

                    {/* Main Content Area for Active Day */}
                    <div className="flex-1 p-6 bg-white">
                        {dayFields.length > 0 && activeDayIndex < dayFields.length && (
                            <div className="max-w-3xl">
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Day {activeDayIndex + 1} Title
                                    </label>
                                    <input
                                        {...register(`days.${activeDayIndex}.title`)}
                                        placeholder="e.g. Arrival in Port Blair & Cellular Jail Visit"
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-lg font-medium"
                                    />
                                </div>

                                {/* Activities for Active Day */}
                                <ActivitiesManager
                                    key={dayFields[activeDayIndex]?.id || activeDayIndex}
                                    control={control}
                                    dayIndex={activeDayIndex}
                                    handleImageUpload={handleImageUpload}
                                    watch={watch}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t flex justify-end gap-4 items-center">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-md">
                    {isSubmitting ? 'Saving Changes...' : (editId ? 'Save Changes' : 'Publish Tour Plan')}
                </button>
            </div>
        </form>
    );
}

// Separate component to manage activities and the modal
function ActivitiesManager({ control, dayIndex, handleImageUpload, watch }: any) {
    const { fields: activityFields, append: appendActivity, remove: removeActivity, update: updateActivity } = useFieldArray({
        control,
        name: `days.${dayIndex}.activities`
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modalData, setModalData] = useState<any>({ type: 'transfer', title: '', description: '', duration: '', images: [] });
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingActivity, setIsDraggingActivity] = useState(false);
    const [draggedActivityIndex, setDraggedActivityIndex] = useState<number | null>(null);

    const openModal = (type: string, index: number | null = null) => {
        if (index !== null) {
            // Edit existing
            const currentActivity = watch(`days.${dayIndex}.activities.${index}`);
            setModalData({ ...currentActivity });
            setEditingIndex(index);
        } else {
            // Add new
            setModalData({ type, title: '', description: '', duration: '', images: [] });
            setEditingIndex(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const saveActivity = () => {
        if (!modalData.title) {
            toast.error("Activity title is required");
            return;
        }

        if (editingIndex !== null) {
            updateActivity(editingIndex, modalData);
        } else {
            appendActivity(modalData);
        }
        closeModal();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            const url = await handleImageUpload(e.target.files[0]);
            if (url) {
                setModalData((prev: any) => ({ ...prev, images: [...prev.images, url] }));
            }
            setIsUploading(false);
        }
    };

    const handleActivityDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingActivity(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setIsUploading(true);
            const url = await handleImageUpload(e.dataTransfer.files[0]);
            if (url) {
                setModalData((prev: any) => ({ ...prev, images: [...prev.images, url] }));
            }
            setIsUploading(false);
        }
    };

    const handleActivityDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingActivity(true);
    };

    const handleActivityDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDraggingActivity(false);
    };

    const handleActivityReorderStart = (index: number) => {
        setDraggedActivityIndex(index);
    };

    const handleActivityReorderDrop = (dropIndex: number) => {
        if (draggedActivityIndex === null || draggedActivityIndex === dropIndex) return;

        setModalData((prev: any) => {
            const newImages = [...prev.images];
            const [draggedImage] = newImages.splice(draggedActivityIndex, 1);
            newImages.splice(dropIndex, 0, draggedImage);
            return { ...prev, images: newImages };
        });
        setDraggedActivityIndex(null);
    };

    const handleActivityReorderDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const removeImage = (indexToRemove: number) => {
        setModalData((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, i: number) => i !== indexToRemove)
        }));
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'transfer': return <Clock size={16} className="text-blue-500" />;
            case 'sightseeing': return <MapPin size={16} className="text-green-500" />;
            case 'hotel': return <ImageIcon size={16} className="text-purple-500" />;
            default: return <MapPin size={16} className="text-gray-500" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'transfer': return 'border-blue-200 bg-blue-50/50';
            case 'sightseeing': return 'border-green-200 bg-green-50/50';
            case 'hotel': return 'border-purple-200 bg-purple-50/50';
            default: return 'border-gray-200 bg-gray-50/50';
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest border-b pb-2 mb-4">Activities & Plan</h3>

            {activityFields.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500 mb-4">No activities added for this day yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activityFields.map((activity: any, index) => {
                        const actDetails = watch(`days.${dayIndex}.activities.${index}`);
                        const type = actDetails?.type || 'other';

                        return (
                            <div key={activity.id} className={`p-4 rounded-xl border ${getActivityColor(type)} group shadow-sm transition-all hover:shadow-md relative overflow-hidden`}>
                                <div className="flex justify-between items-start gap-4 mr-16">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-white p-2 rounded-lg shadow-sm shrink-0">
                                            {getActivityIcon(type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{type}</span>
                                                {actDetails?.duration && (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock size={10} /> {actDetails.duration}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-gray-900 text-lg mt-0.5">{actDetails?.title || 'Untitled Activity'}</h4>
                                            {actDetails?.description && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{actDetails.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    {actDetails?.images && actDetails.images.length > 0 && (
                                        <div className="hidden sm:flex -space-x-3 mt-2 shrink-0">
                                            {actDetails.images.slice(0, 3).map((img: string, i: number) => (
                                                <img key={i} src={getOptimizedImageUrl(img, 40)} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100" width={40} height={40} loading="lazy" decoding="async" />
                                            ))}
                                            {actDetails.images.length > 3 && (
                                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm z-10 relative">
                                                    +{actDetails.images.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => openModal(type, index)}
                                        className="p-1.5 bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 transition-colors border border-gray-100"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeActivity(index)}
                                        className="p-1.5 bg-white rounded shadow-sm text-gray-600 hover:text-red-600 transition-colors border border-gray-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => openModal('transfer')} className="text-sm text-blue-700 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium transition flex items-center gap-2 shadow-sm">
                    <Clock size={16} /> Add Transfer
                </button>
                <button type="button" onClick={() => openModal('sightseeing')} className="text-sm text-green-700 bg-green-50 border border-green-100 px-4 py-2 rounded-lg hover:bg-green-100 font-medium transition flex items-center gap-2 shadow-sm">
                    <MapPin size={16} /> Add Sightseeing
                </button>
                <button type="button" onClick={() => openModal('hotel')} className="text-sm text-purple-700 bg-purple-50 border border-purple-100 px-4 py-2 rounded-lg hover:bg-purple-100 font-medium transition flex items-center gap-2 shadow-sm">
                    <ImageIcon size={16} /> Add Hotel
                </button>
            </div>

            {/* Activity Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold flex items-center gap-2 capitalize text-gray-800">
                                {getActivityIcon(modalData.type)}
                                {editingIndex !== null ? 'Edit' : 'Add'} {modalData.type}
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Activity Type</label>
                                    <select
                                        value={modalData.type}
                                        onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="transfer">Transfer</option>
                                        <option value="sightseeing">Sightseeing</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="meal">Meal</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration / Meta Info</label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            value={modalData.duration}
                                            onChange={(e) => setModalData({ ...modalData, duration: e.target.value })}
                                            placeholder="e.g. 2 hrs, 1 Night"
                                            className="block w-full pl-10 rounded-lg border-gray-300 border p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={modalData.title}
                                        onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                                        placeholder={modalData.type === 'transfer' ? 'Private Transfer Airport to Hotel' : 'Sightseeing in Port Blair'}
                                        required
                                        autoFocus
                                        className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border text-base font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description / Inclusions</label>
                                    <textarea
                                        value={modalData.description}
                                        onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                                        rows={3}
                                        placeholder="Add details about what is included or what to expect..."
                                        className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                                    ></textarea>
                                </div>

                                <div className="sm:col-span-2 mt-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Images</label>
                                    <div className="flex gap-3 flex-wrap">
                                        {modalData.images.map((img: string, i: number) => (
                                            <div
                                                key={i}
                                                className="relative w-24 h-24 rounded-xl overflow-hidden border shadow-sm group bg-gray-100 cursor-move"
                                                draggable
                                                onDragStart={() => handleActivityReorderStart(i)}
                                                onDragOver={handleActivityReorderDragOver}
                                                onDrop={() => handleActivityReorderDrop(i)}
                                            >
                                                <img src={getOptimizedImageUrl(img, 96)} alt="Activity" className="w-full h-full object-cover select-none pointer-events-none" width={96} height={96} loading="lazy" decoding="async" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(i);
                                                    }}
                                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-500 z-10"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {isUploading && (
                                            <div className="w-24 h-24 border-2 border-gray-200 bg-gray-50 rounded-xl flex items-center justify-center shadow-inner">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            </div>
                                        )}
                                        <label
                                            className={`w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${isDraggingActivity ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-500 bg-gray-50'}`}
                                            onDrop={handleActivityDrop}
                                            onDragOver={handleActivityDragOver}
                                            onDragLeave={handleActivityDragLeave}
                                        >
                                            <UploadCloud size={24} className="mb-1" />
                                            <span className="text-xs font-medium">Upload</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                                Cancel
                            </button>
                            <button type="button" onClick={saveActivity} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                                Save Activity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
