import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUsers, FaBook, FaComments, FaBookOpen } from 'react-icons/fa';
import useAuthApi from '../../services/authServices';

const AdminLayout = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuthApi();

    const menuItems = [
        { 
            title: 'QUẢN LÝ NGƯỜI DÙNG',
            items: [
                { name: 'Users', path: '/admin/users', icon: <FaUsers className="mr-2" /> }
            ]
        },
        {
            title: 'QUẢN LÝ NỘI DUNG',
            items: [
                { name: 'Sách', path: '/admin/stories', icon: <FaBook className="mr-2" /> },
                { name: 'Chương', path: '/admin/chapters', icon: <FaBookOpen className="mr-2" /> },
                { name: 'Bình luận', path: '/admin/comments', icon: <FaComments className="mr-2" /> }
            ]
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-[#417690] text-white px-6 py-3">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/admin" className="text-2xl font-semibold">
                        Administration
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span>Welcome, Admin</span>
                        <Link to="/" className="hover:text-gray-300">VIEW SITE</Link>
                        <span>/</span>
                        <button onClick={handleLogout} className="hover:text-gray-300">
                            LOG OUT
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-[#79aec8] text-white px-6 py-3">
                <div className="container mx-auto">
                    <div className="flex items-center space-x-2">
                        <Link to="/admin" className="hover:text-gray-300">Home</Link>
                        {location.pathname !== '/admin' && (
                            <>
                                <span>/</span>
                                <span className="capitalize">
                                    {location.pathname.split('/').filter(Boolean).slice(1).join(' / ')}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow p-4">
                            <form onSubmit={handleSearch} className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-3 py-2 border rounded"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>

                            {menuItems.map((section, index) => (
                                <div key={index} className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                                        {section.title}
                                    </h3>
                                    <ul>
                                        {section.items.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <Link
                                                    to={item.path}
                                                    className={`flex items-center py-2 px-3 rounded ${
                                                        location.pathname === item.path
                                                            ? 'bg-[#417690] text-white'
                                                            : 'text-[#417690] hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {item.icon}
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout; 