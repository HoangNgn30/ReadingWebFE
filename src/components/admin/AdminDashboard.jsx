import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '../header/Header';
import useAuthApi from '../../services/authServices';
import storyApi from '../../services/storyServices';
import useAdminApi from '../../services/adminServices';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getRole } = useAuthApi();
    const { getAllStories } = storyApi();
    const { getAllUsers, deleteUser, updateUserRole, deleteStory } = useAdminApi();

    useEffect(() => {
        const checkAdminRole = () => {
            const roleId = getRole();
            if (roleId !== 0) { 
                window.location.href = '/';
                toast.error('Bạn không có quyền truy cập trang này');
            }
        };

        checkAdminRole();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersResponse = await getAllUsers();
            const storiesResponse = await getAllStories();
            setUsers(usersResponse.data);
            setStories(storiesResponse.data);
            setIsLoading(false);
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            return;
        }

        try {
            const response = await deleteUser(userId);
            if (response.status === 200) {
                toast.success('Xóa người dùng thành công');
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng');
        }
    };

    const handleUpdateUserRole = async (userId, currentRole) => {
        const newRole = currentRole === 1 ? 2 : 1; // Toggle between admin and user
        try {
            const response = await updateUserRole(userId, newRole);
            if (response.status === 200) {
                toast.success('Cập nhật vai trò thành công');
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò');
        }
    };

    const handleDeleteStory = async (storyId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa truyện này?')) {
            return;
        }

        try {
            const response = await deleteStory(storyId);
            if (response.status === 200) {
                toast.success('Xóa truyện thành công');
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa truyện');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-bgColor mt-20">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản trị hệ thống</h1>
                    
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`px-4 py-2 font-medium ${
                                activeTab === 'users'
                                    ? 'text-secondary border-b-2 border-secondary'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('users')}
                        >
                            Quản lý người dùng
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${
                                activeTab === 'stories'
                                    ? 'text-secondary border-b-2 border-secondary'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('stories')}
                        >
                            Quản lý truyện
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {activeTab === 'users' ? (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tên người dùng
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Vai trò
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.username}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            className={`px-2 py-1 rounded ${
                                                                user.role === 1
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}
                                                            onClick={() => handleUpdateUserRole(user.id, user.role)}
                                                        >
                                                            {user.role === 1 ? 'Admin' : 'User'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Danh sách truyện</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tên truyện
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tác giả
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {stories.map((story) => (
                                                <tr key={story.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {story.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {story.author}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {story.status}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteStory(story.id)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard; 