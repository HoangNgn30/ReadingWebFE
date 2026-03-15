import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthApi from '../../services/authServices';

const ResetPassword = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { resetPassword } = useAuthApi();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const response = await resetPassword(usernameOrEmail);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu', { autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Video background */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <video
                    src="/src/assets/login1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-screen object-cover"
                />
            </div>

            {/* Right side - Form */}
            <div className="flex w-full items-center justify-center bg-bgColor lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl bg-bgColorOne p-10 shadow-xl">
                    <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mật khẩu mới */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Tài khoản</label>
                            <input
                                type="text"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                placeholder="Nhập tên đăng nhập hoặc email"
                                required
                            />
                        </div>

                        {/* Nút đặt lại mật khẩu */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-secondary py-3 text-white transition-colors hover:bg-secondaryOne hover:text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>

                    {/* Quay lại đăng nhập */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <a href="/login" className="font-medium text-secondary hover:text-secondary hover:underline">
                            Quay lại đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword; 