import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import storyApi from '../../services/storyServices';
import Header from '../header/Header';
import EditStory from '../item/EditStory';

const ManagedStories = () => {
    const { getManagedStories, deleteStory } = storyApi();
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('approved'); // 'approved' or 'pending'

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await getManagedStories();
            if (response.status === 200) {
                setStories(response.managedStories);
            }
        } catch (error) {
            console.log(error);
            toast.error('Không thể tải danh sách sách', { autoClose: 1000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (storyId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
            return;
        }

        try {
            const response = await deleteStory(storyId);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                fetchStories(); 
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa sách', { autoClose: 3000 });
        }
    };

    const filteredStories = stories.filter(story => 
        activeTab === 'approved' ? story.isApproved : !story.isApproved
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <>
            <Header></Header>
            <div className="min-h-screen bg-bgColor mt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Quản lý sách</h1>
                        <a
                            href="/add-story"
                            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondaryOne hover:text-black transition-colors"
                        >
                            Đăng sách mới
                        </a>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab('approved')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'approved'
                                    ? 'bg-secondary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Sách đã duyệt
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'pending'
                                    ? 'bg-secondary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Sách chờ duyệt
                        </button>
                    </div>

                    {filteredStories.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {activeTab === 'approved' 
                                    ? 'Bạn chưa có sách nào được duyệt.'
                                    : 'Bạn chưa có sách nào đang chờ duyệt.'}
                            </p>
                            <a
                                href="/add-story"
                                className="text-secondary hover:text-secondaryOne mt-2 inline-block"
                            >
                                Đăng sách ngay
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredStories.map((story) => (
                                <EditStory key={story.id} story={story} handleDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ManagedStories; 