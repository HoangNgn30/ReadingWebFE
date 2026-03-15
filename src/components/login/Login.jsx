import { useState } from 'react';
import loginVideo from '../../assets/login1.mp4';
import { useNavigate } from 'react-router-dom';
import useAuthApi from '../../services/authServices';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthApi();
    const [isLoading, setIsLoading] = useState(false);

    const [usernameOrEmail, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await login({ usernameOrEmail, password });
            //console.log(response.data.message);
            if (response.status === 200) {
                navigate('/');
                //toast.success(response.data.message, { autoClose: 1000 });
            } else {
                toast.error(response.data.message, { autoClose: 1000 });
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại!', { autoClose: 1000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side  */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <video
                    src={loginVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-screen object-cover"
                />
            </div>

            {/* Right side */}
            <div className="flex w-full items-center justify-center bg-bgColor lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl bg-bgColorOne p-10 shadow-xl">
                    <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Đăng nhập</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tên tài khoản */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Tên tài khoản</label>
                            <input
                                type="text"
                                value={usernameOrEmail}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                placeholder="Nhập tên tài khoản"
                                required
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                placeholder="Nhập mật khẩu"
                                required
                            />
                        </div>

                        {/* Nút đăng nhập */}
                        <button
                            type="submit"
                            onSubmit={handleSubmit}
                            className="w-full rounded-lg bg-secondary py-3 text-white transition-colors hover:bg-secondaryOne hover:text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2"
                        >
                            Đăng nhập
                        </button>

                        {/* Quên mật khẩu */}
                        <div className="text-right">
                            <a href="/reset-password" className="text-sm text-secondary hover:text-secondary hover:underline">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </form>

                    {/* Hoặc */}
                    <div className="my-8 flex items-center">
                        <div className="h-px flex-1 bg-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">Hoặc</span>
                        <div className="h-px flex-1 bg-gray-300"></div>
                    </div>

                    {/* Đăng ký tài khoản */}
                    <div className="text-center text-sm text-gray-600">
                        Bạn chưa có tài khoản?{' '}
                        <a href="/signup" className="font-medium text-secondary hover:text-secondary hover:underline">
                            Đăng ký tài khoản
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
