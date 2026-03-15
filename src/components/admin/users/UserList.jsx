import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAdminApi from '../../../services/adminServices';
import { FaTimes } from 'react-icons/fa';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const { getAllUsers, deleteUser, addAdminRole, deleteAdminRole } = useAdminApi();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
            setIsLoading(false);
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng');
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            return;
        }

        try {
            await deleteUser(userId);
            toast.success('Xóa người dùng thành công');
            fetchUsers();
        } catch (error) {
            toast.error('Không thể xóa người dùng');
        }
    };

    const handleBulkAction = async (action) => {
        if (!window.confirm('Bạn có chắc chắn muốn thực hiện hành động này?')) {
            return;
        }

        try {
            await Promise.all(
                selectedUsers.map(userId => {
                    if(action === 'delete')
                        return deleteUser(userId);
                    if(action === 'admin') 
                        return addAdminRole(userId);
                    if(action === 'deleteadmin')
                        return deleteAdminRole(userId);
                })
            );
            toast.success('Thực hiện hành động thành công', {autoClose: 500});
            fetchUsers();
            setSelectedUsers([]);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thực hiện hành động', {autoClose: 500});
        }
    };

    const filteredUsers = users.filter(user => {
        let matches = true;

        // Filter by role
        if (filters.role === '0') {
            matches = matches && user.roleId == 0;
        }
        if (filters.role === '1') {
            let check = false;
            if(user.roleId == 1 || user.roleId == 2) check = true;
            matches = matches && check;
        }
        if (filters.role === '3') {
            matches = matches && user.roleId == 3;
        }
        

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matches = matches && (
                user.username.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
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
            <div className="mb-6 flex gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        className="border rounded px-3 py-2"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    >
                        <option value="all">All</option>
                        <option value="0">Admin</option>
                        <option value="1">Manager</option>
                        <option value="3">Reader</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
                    <select
                        className="border rounded px-3 py-2"
                        onChange={(e) => handleBulkAction(e.target.value)}
                    >
                        <option value="">----- Chọn hành động -----</option>
                        <option value="delete">Xóa tài khoản đã chọn</option>
                        <option value="admin">Chuyển thành tài khoản admin</option>
                        <option value="deleteadmin">Xóa quyền admin</option>
                    </select>
                    <span className="text-sm text-gray-600">
                        {selectedUsers.length} người dùng được chọn
                    </span>
                </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="w-12 px-6 py-3">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedUsers(filteredUsers.map(user => user.id));
                                        } else {
                                            setSelectedUsers([]);
                                        }
                                    }}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedUsers([...selectedUsers, user.id]);
                                            } else {
                                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.roleId === 0 ? (
                                        "Admin"
                                    ) : user.roleId === 3 ? (
                                        "Reader"
                                    ) : (
                                        "Manager"
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteUser(user.id)}
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

export default UserList; 