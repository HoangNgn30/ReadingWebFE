import { useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from './Navbar';
import { CgMenuLeft } from 'react-icons/cg';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { VscAccount } from 'react-icons/vsc';
import logo from '../../assets/logo.png';
import useAuthApi from '../../services/authServices';
import notificationApi from '../../services/notificationServices';
import NotiDropdown from './NotiDropdown';

ReactModal.setAppElement('#root');

function Header({ onChangeSettings }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [menuOpened, setMenuOpened] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { logout, getRole } = useAuthApi();
    const navigate = useNavigate();
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const notiRef = useRef(null);
    const [unreadNotiCount, setUnreadNotiCount] = useState(0);
    const { getNotification, readNotification } = notificationApi();
    const [notifications, setNotifications] = useState([]);

    const toggleMenu = () => {
        setMenuOpened((prev) => !prev);
    };

    useEffect(() => {
        const token = Cookies.get('jwt');
        setIsLoggedIn(!!token);
        if (token) {
            const roleId = getRole();
            setIsAdmin(roleId === 0);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Set up polling interval (every 10 seconds)
        const intervalId = setInterval(fetchNotifications, 10000);
        return () => clearInterval(intervalId);
    }, []);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Add click outside handler for notification dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notiRef.current && !notiRef.current.contains(event.target)) {
                setIsNotiOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menu = [
        { to: '/profile', label: 'Thông tin tài khoản' },
        { to: '/followed', label: 'Danh sách theo dõi' },
        { to: '/add-story', label: 'Đăng sách' },
        { to: '/managed-story', label: 'Quản lý sách' },
    ];

    if (isAdmin) {
        menu.push({ to: '/admin', label: 'Quản trị hệ thống' });
    }

    const handleLogOut = async () => {
        try {
            const response = await logout();
            setIsLoggedIn(false);
            //toast.success(response.data.message, { autoClose: 1000 });
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            toast.error('Đăng xuất thất bại, hãy thử lại!');
            console.error(error);
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const fetchNotifications = async () => {
        try {
            const response = await getNotification();
            if (response.status === 200) {
                setNotifications(response.data.notifications);
                const unreadCount = response.data.notifications.filter(noti => !noti.isRead).length;
                setUnreadNotiCount(unreadCount);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleNotificationClick = async () => {
        try {
            const unreadNotis = notifications.filter(noti => !noti.isRead);
            if (unreadNotis.length > 0) {
                await Promise.all(unreadNotis.map(noti => readNotification(noti.id)));
                setUnreadNotiCount(0); 
                await fetchNotifications();
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra khi cập nhật thông báo");
        }
        setIsNotiOpen(!isNotiOpen);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-[80px] w-screen bg-white shadow-sm z-50">
            <div className="max-pad-container h-full flex items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold w-[200px]">
                    <img src={logo} alt="logo" className="h-[80px] w-auto" />
                </Link>

                {/* Navigation */}
                <div className="flex-1 flex justify-center">
                    <Navbar
                        containerStyles={`${
                            menuOpened
                                ? 'flex flex-col gap-y-16 h-screen w-[200px] absolute left-0 top-0 z-50 bg-white px-10 py-4 shadow-xl'
                                : 'hidden lg:flex justify-center gap-x-8 lg:gap-x-14 medium-15 px-2 py-1'
                        }`}
                        toggleMenu={toggleMenu}
                        menuOpened={menuOpened}
                        onChangeSettings={onChangeSettings}
                    />
                </div>

                {/* Right Section - Menu, Search & User */}
                <div className="flex items-center gap-x-4 w-[500px] justify-end m-10">
                    {/* Menu Button */}
                    <CgMenuLeft
                        onClick={toggleMenu}
                        className="w-auto h-5 text-black text-2xl lg:hidden cursor-pointer mr-[10px]"
                    />

                    {/* Notification */}
                    <div className="relative" ref={notiRef}>
                        <button onClick={handleNotificationClick} className="relative">
                            <IoMdNotificationsOutline className="w-auto h-8 mt-[6px] mr-[15px] text-black" />
                            {unreadNotiCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                        <NotiDropdown 
                            isOpen={isNotiOpen} 
                            onClose={() => setIsNotiOpen(false)} 
                            notifications={notifications}
                        />
                    </div>

                    {/* Account Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <VscAccount
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-auto h-8 cursor-pointer hover:text-secondary transition-colors"
                        />
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                {isLoggedIn ? (
                                    <>
                                        {menu.map((item, index) => (
                                            <Link
                                                key={index}
                                                to={item.to}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={() => {
                                                handleLogOut();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleLogin();
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Đăng nhập
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
