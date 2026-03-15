import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAdminApi from '../../../services/adminServices';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { useAuthorClick } from '../../../utils/authorUtils';

const CommentList = () => {
    const [comments, setComments] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { getAllComments, deleteComment } = useAdminApi();
    const handleAuthorClick = useAuthorClick();

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await getAllComments();
            setComments(response.data);
            setIsLoading(false);
        } catch (error) {
            toast.error('Không thể tải danh sách bình luận', {autoClose: 500});
            setIsLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            return;
        }

        try {
            await deleteComment(commentId);
            toast.success('Xóa bình luận thành công', {autoClose: 500});
            fetchComments();
        } catch (error) {
            toast.error('Không thể xóa bình luận', {autoClose: 500});
        }
    };

    const handleBulkAction = async (action) => {
        if (!window.confirm('Bạn có chắc chắn muốn thực hiện hành động này?')) {
            return;
        }

        try {
            await Promise.all(
                selectedComments.map(commentId => {
                    switch (action) {
                        case 'delete':
                            return deleteComment(commentId);
                        default:
                            return Promise.resolve();
                    }
                })
            );
            toast.success('Thực hiện hành động thành công', {autoClose: 500});
            fetchComments();
            setSelectedComments([]);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thực hiện hành động', {autoClose: 500});
        }
    };

    const filteredComments = comments.filter(comment => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            comment.Users.username.toLowerCase().includes(query) ||
            comment.Stories.title.toLowerCase().includes(query)
        );
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
                <h1 className="text-2xl font-semibold">Quản lý bình luận</h1>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2"
                        placeholder="Tìm kiếm bình luận..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedComments.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
                    <select
                        className="border rounded px-3 py-2"
                        onChange={(e) => handleBulkAction(e.target.value)}
                    >
                        <option value="">----- Chọn hành động -----</option>
                        <option value="delete">Xóa bình luận đã chọn</option>
                    </select>
                    <span className="text-sm text-gray-600">
                        {selectedComments.length} bình luận được chọn
                    </span>
                </div>
            )}

            {/* Comments Table */}
            <div className="max-w-4xl overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="w-12 px-6 py-3">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedComments(filteredComments.map(comment => comment.id));
                                        } else {
                                            setSelectedComments([]);
                                        }
                                    }}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người dùng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Truyện
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nội dung
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredComments.map((comment) => (
                            <tr key={comment.id}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedComments.includes(comment.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedComments([...selectedComments, comment.id]);
                                            } else {
                                                setSelectedComments(selectedComments.filter(id => id !== comment.id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{comment.Users.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`/story/${comment.Stories.id}`}>{comment.Stories.title}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="max-w-xs truncate">{comment.content}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteComment(comment.id)}
                                            title="Xóa"
                                        >
                                            <FaTimes />
                                        </button>
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

export default CommentList; 