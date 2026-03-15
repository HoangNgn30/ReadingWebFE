import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';
import useAuthApi from '../../services/authServices';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
    const navigate = useNavigate();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const { getProfile, updateUser, updatePassword } = useAuthApi();
    const [profile, setProfile] = useState({
        username: '',
        id: '',
        email: '',
        avatar: 'https://i.imgur.com/0y0y0y0.png', 
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setProfile(response);
            } catch (error) {
                toast.error('Không thể tải hồ sơ người dùng', {autoClose: 1000});
            }
        };

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfile(prev => ({ ...prev, avatar: imageUrl }));
        }
    };

    const handleProfileSubmit = async () => {
        try {
            const response = await updateUser(profile.username, profile.avatar);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                navigate('/profile');
            } else {
                toast.error(response.data.message, { autoClose: 1000 });
                navigate(0);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi chỉnh sửa', { autoClose: 3000 });
        }
    };

    const handleSavePassword = async () => {
        try {
            const response = await updatePassword(passwords.oldPassword, passwords.newPassword);
            console.log(response);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                navigate('/profile');
            } else {
                toast.error(response.data.message || "Xảy ra lỗi", { autoClose: 1000 });
                navigate(0);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi chỉnh sửa', { autoClose: 3000 });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submit');
        try {
            if (showChangePassword) {
                if (passwords.newPassword !== passwords.confirmPassword) {
                    alert("Mật khẩu nhập lại chưa trùng khớp");
                    return;
                }
                await handleSavePassword();
            } else {
                await handleProfileSubmit();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className="flex-grow bg-bgColor">
                <div className="bg-white h-24 w-full rounded-t-xl shadow-md"></div>
                <div>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                {/* Main Content Container */}
                <div className="w-[85%] max-w-6xl mx-auto bg-bgColorOne rounded-xl flex flex-row p-8 mt-[-2rem] shadow-xl relative z-10 mb-8">
                    {/* Sidebar */}
                    <div className="flex flex-col w-1/4 min-w-[200px] mr-10 justify-start border-r border-gray-200 pr-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-10">Tài khoản</h2>
                        <button
                            className={`text-left text-2xl mb-8 transition-all duration-300 ${
                                !showChangePassword
                                    ? 'text-green-700 font-bold border-l-4 border-green-600 pl-4'
                                    : 'text-gray-600 hover:text-green-600'
                            }`}
                            onClick={() => setShowChangePassword(false)}
                        >
                            Quản lý tài khoản
                        </button>
                        <button
                            className={`text-left text-2xl transition-all duration-300 ${
                                showChangePassword
                                    ? 'text-green-700 font-bold border-l-4 border-green-600 pl-4'
                                    : 'text-gray-600 hover:text-green-600'
                            }`}
                            onClick={() => setShowChangePassword(true)}
                        >
                            Đổi mật khẩu
                        </button>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 flex flex-row items-start">
                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {showChangePassword ? (
                                <>
                                <input name="oldPassword" />
                                <input name="newPassword"/>
                                <input name="confirmPassword"/>
                                </>
                            ) : (
                                <>
                                <input name="username"/>
                                <input name="userId"/>
                                <input name="email"/>
                                </>
                            )}
                            <button type="submit">
                                {showChangePassword ? 'Cập nhật mật khẩu' : 'Lưu thay đổi'}
                            </button>
                        </form>

                        {/* Avatar và nút thay ảnh */}
                        {!showChangePassword && (
                            <div className="flex flex-col items-center justify-start ml-12 mt-2 min-w-[280px]">
                                <div className="relative">
                                    <img
                                        src={profile.avatar}
                                        alt="avatar"
                                        className="w-40 h-40 rounded-full object-cover mb-8 border-4 border-white shadow-xl"
                                    />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                                <button
                                    type="button"
                                    onClick={handleButtonClick}
                                    className="border-2 border-green-600 text-green-600 rounded-xl px-10 py-3 text-xl font-bold bg-white hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
                                >
                                    Thay ảnh
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <br />
                    <br />
                    <br />

                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Profile;
