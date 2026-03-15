import PropTypes from 'prop-types';
import { FaRegWindowClose } from 'react-icons/fa';
import { NavLink, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import GenreDropdown from './GenreDropdown';
import SettingDropdown from './SettingDropdown';
import React from 'react';

const Navbar = ({ containerStyles, toggleMenu, menuOpened, onChangeSettings }) => {
    const location = useLocation();
    const [isSettingOpen, setIsSettingOpen] = React.useState(false);
    // Kiểm tra nếu route là /:storyId/:chapterNumber (ChapterInfo)
    const chapterInfoRegex = /^\/[\w-]+\/\d+$/;
    const isChapterInfo = chapterInfoRegex.test(location.pathname);
    // Kiểm tra nếu route là /story/:storyId (StoryInfo)
    const storyInfoRegex = /^\/story\/[\w-]+$/;
    const isStoryInfo = storyInfoRegex.test(location.pathname);

    const navItems = [
        { to: '/', label: 'Trang chủ' },
        { to: '/categories', label: 'Thể loại', isDropdown: true },
        { to: '/followed', label: 'Theo dõi' },
        { to: '/books', label: 'Tìm sách' },
    ];
    if (isChapterInfo && !isStoryInfo) {
        navItems.push({ to: '', label: 'Tùy chỉnh', isSetting: true });
    }

    const renderNavItem = ({ to, label, isDropdown, isSetting }) => {
        if (isDropdown) {
            return <GenreDropdown />;
        }
        if (isSetting) {
            return (
                <div className="relative">
                    <button
                        type="button"
                        className="medium-16 text-black hover:text-secondary hover:underline"
                        onClick={() => setIsSettingOpen((prev) => !prev)}
                    >
                        {label}
                    </button>
                    {isSettingOpen && (
                        <div className="absolute left-0 mt-2 z-50">
                            <SettingDropdown onChangeSettings={onChangeSettings} />
                        </div>
                    )}
                </div>
            );
        }
        return (
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `items-center justify-between gap-x-2 ${
                        isActive ? 'text-secondary font-medium' : 'text-black hover:text-secondary hover:underline'
                    }`
                }
            >
                <span className="medium-16">{label}</span>
            </NavLink>
        );
    };

    return (
        <nav className={containerStyles}>
            {menuOpened && (
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-start w-full">
                        <Link to="/" className="text-xl font-bold mt-4">
                            <img src={logo} alt="logo" className="h-[50px] w-auto" />
                        </Link>
                        <FaRegWindowClose onClick={toggleMenu} className="text-xl cursor-pointer mt-4" />
                    </div>

                    <div className="mt-8">
                        {navItems.map((item) => (
                            <div key={item.label} className="mb-4">
                                {renderNavItem(item)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!menuOpened && (
                <div className="flex items-center gap-7">
                    {navItems.map((item) => (
                        <div key={item.label} className="inline-flex text-xl relative top-1">
                            {renderNavItem(item)}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
