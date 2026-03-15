import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAdminApi from '../../../services/adminServices';
import { FaEdit, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ChapterList = () => {
    const navigator = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        pending: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const { getAllChapters, deleteChapter, getPendingChapters, approveChapter, dropChapter } = useAdminApi();

    useEffect(() => {
        fetchChapters();
    }, [filters.pending]);

    const fetchChapters = async () => {
        try {
            const response = filters.pending
                ? await getPendingChapters()
                : await getAllChapters();
            setIsLoading(false);
            setChapters(response.data);
        } catch (error) {
            toast.error('Không thể tải danh sách chương', {autoClose: 1000});
            setIsLoading(false);
        }
    };

    const handleApproveChapter = async (chapterId) => {
        try {
            await approveChapter(chapterId);
            toast.success('Phê duyệt chương thành công', {autoClose: 500});
            fetchChapters();
        } catch (error) {
            toast.error('Không thể phê duyệt chương', {autoClose: 500});
    const handleEditChapter = async (chapter) => {
        try {
            navigator(`/update-chapter/${chapter.Story.id}/${chapter.chapterNumber}`);
        } catch (error) {
            console.log(error);
            toast.error('Không thể tải chương', {autoClose: 1000});
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa chương này?')) {
            return;
        }

        try {
            await deleteChapter(chapterId);
            toast.success('Xóa chương thành công', {autoClose: 1000});
            fetchChapters();
        } catch (error) {
            toast.error('Không thể xóa chương', {autoClose: 1000});
        }
    };

    const handleDropChapter = async (chapterId) => {
        try {
            await dropChapter(chapterId);
            toast.success('Hủy phê duyệt thành công', {autoClose: 500});
            fetchChapters();
        } catch (error) {
            toast.error('Không thể hủy phê duyệt', {autoClose: 500});
            await approveChapter(chapterId);
            toast.success('Phê duyệt chương thành công', {autoClose: 500});
            fetchChapters();
        } catch (error) {
            toast.error('Không thể phê duyệt chương', {autoClose: 500});
        }
    };

    const handleBulkAction = async (action) => {
        if (!window.confirm('Bạn có chắc chắn muốn thực hiện hành động này?')) {
            return;
        }

        try {
            await Promise.all(
                selectedChapters.map(chapterId => {
                    switch (action) {
                        case 'drop':
                            return dropChapter(chapterId);
                        case 'approve':
                            return approveChapter(chapterId);
                        default:
                            return Promise.resolve();
                    }
                })
            );
            toast.success('Thực hiện hành động thành công', {autoClose: 500});
            fetchChapters();
            setSelectedChapters([]);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thực hiện hành động', {autoClose: 500});
        }
    };

    const filteredChapters = chapters.filter(chapter => {
        let matches = true;

        if (chapter.id === 10) return false;

        // Filter by status
        if (filters.status !== 'all') {
            const filter = parseInt(filters.status) === 1 ? true : false;
            matches = matches && chapter.isApproved === filter;
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matches = matches && (
                chapter.title.toLowerCase().includes(query) ||
                chapter.Story.title.toLowerCase().includes(query)
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
                <h1 className="text-2xl font-semibold">Quản lý chương</h1>
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
                        placeholder="Tìm kiếm chương..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedChapters.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
                    <select
                        className="border rounded px-3 py-2"
                        onChange={(e) => handleBulkAction(e.target.value)}
                    >
                        <option value="">----- Chọn hành động -----</option>
                        <option value="drop">Hủy phê duyệt chương đã chọn</option>
                        <option value="approve">Phê duyệt chương đã chọn</option>
                    </select>
                    <span className="text-sm text-gray-600">
                        {selectedChapters.length} chương được chọn
                    </span>
                </div>
            )}

            {/* Chapters Table */}
            <div className="max-w-4xl overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="w-12 px-6 py-3">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedChapters(filteredChapters.map(chapter => chapter.id));
                                        } else {
                                            setSelectedChapters([]);
                                        }
                                    }}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiêu đề 
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thuộc sách
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số chương
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
                        {filteredChapters.map((chapter) => (
                            <tr key={chapter.id}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedChapters.includes(chapter.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedChapters([...selectedChapters, chapter.id]);
                                            } else {
                                                setSelectedChapters(selectedChapters.filter(id => id !== chapter.id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`/${chapter.Story.id}/${chapter.chapterNumber}`}>{chapter.title}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`/story/${chapter.Story.id}`}>{chapter.Story.title}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap">{chapter.chapterNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(chapter.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        {chapter.isApproved == false ? (
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => handleApproveChapter(chapter.id)}
                                                title="Phê duyệt"
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        ) : <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDropChapter(chapter.id)}
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

export default ChapterList; 