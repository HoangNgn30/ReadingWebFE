import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAdminApi from '../../../services/adminServices';
import { FaEdit, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuthorClick } from '../../../utils/authorUtils';

const StoryList = () => {
    const navigator = useNavigate();
    const [stories, setStories] = useState([]);
    const [selectedStories, setSelectedStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        pending: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const { getAllStories, getPendingStories, approveStory, dropStory } = useAdminApi();
    const handleAuthorClick = useAuthorClick();

    useEffect(() => {
        fetchStories();
    }, [filters.pending]);

    const fetchStories = async () => {
        try {
            const response = filters.pending
                ? await getPendingStories()
                : await getAllStories();
            setStories(response.data);
            //console.log(response.data)
            setIsLoading(false);
        } catch (error) {
            toast.error('Không thể tải danh sách truyện');
            setIsLoading(false);
        }
    };

    const handleApproveStory = async (storyId) => {
        try {
            await approveStory(storyId);
            toast.success('Phê duyệt truyện thành công', {autoClose: 500});
            fetchStories();
        } catch (error) {
            toast.error('Không thể phê duyệt truyện', {autoClose: 500});
        }
    };

    const handleDropStory = async (storyId) => {
        try {
            await dropStory(storyId);
            toast.success('Hủy phê duyệt truyện thành công', {autoClose: 500});
            fetchStories();
        } catch (error) {
            toast.error('Không thể hủy phê duyệt truyện', {autoClose: 500});
        }
    };

    const handleBulkAction = async (action) => {
        if (!window.confirm('Bạn có chắc chắn muốn thực hiện hành động này?')) {
            return;
        }

        try {
            await Promise.all(
                selectedStories.map(storyId => {
                    switch (action) {
                        case 'drop':
                            return dropStory(storyId);
                        case 'approve':
                            return approveStory(storyId);
                        default:
                            return Promise.resolve();
                    }
                })
            );
            toast.success('Thực hiện hành động thành công', {autoClose: 500});
            fetchStories();
            setSelectedStories([]);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thực hiện hành động', {autoClose: 500});
        }
    };

    const filteredStories = stories.filter(story => {
        let matches = true;

        if (story.id === 1) return false;

        // Filter by status
        if (filters.status !== 'all') {
            const filter = parseInt(filters.status) === 1 ? true : false;
            matches = matches && story.isApproved === filter;
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matches = matches && (
                story.title.toLowerCase().includes(query) ||
                story.authorName.toLowerCase().includes(query)
            );
        }

        return matches;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#417690]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Quản lý truyện</h1>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                        className="border rounded px-3 py-2"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">Tất cả</option>
                        <option value="1">Đã phê duyệt</option>
                        <option value="0">Chưa phê duyệt</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2"
                        placeholder="Tìm kiếm truyện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedStories.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
                    <select
                        className="border rounded px-3 py-2"
                        onChange={(e) => handleBulkAction(e.target.value)}
                    >
                        <option value="">----- Chọn hành động -----</option>
                        <option value="drop">Hủy phê duyệt truyện đã chọn</option>
                        <option value="approve">Phê duyệt truyện đã chọn</option>
                    </select>
                    <span className="text-sm text-gray-600">
                        {selectedStories.length} truyện được chọn
                    </span>
                </div>
            )}

            {/* Stories Table */}
            <div className="max-w-4xl overflow-x-auto">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="w-12 px-6 py-3">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedStories(filteredStories.map(story => story.id));
                                        } else {
                                            setSelectedStories([]);
                                        }
                                    }}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiêu đề
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tác giả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thể loại
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStories.map((story) => (
                            <tr key={story.id}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedStories.includes(story.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedStories([...selectedStories, story.id]);
                                            } else {
                                                setSelectedStories(selectedStories.filter(id => id !== story.id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`/story/${story.id}`}>{story.title}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        type="button"
                                        className="text-secondary hover:text-primary transition-colors"
                                        onClick={() => handleAuthorClick(story.authorName)}
                                    >
                                        {story.authorName}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{story.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{story.genre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(story.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        {story.isApproved == false ? (
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => handleApproveStory(story.id)}
                                                title="Phê duyệt"
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        ) : 
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDropStory(story.id)}
                                            title="Từ chối"
                                        >
                                            <FaTimes />
                                        </button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoryList; 