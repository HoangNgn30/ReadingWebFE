import httpRequest from '../utils/httpRequest';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const useAuthApi = () => {
    const login = async ({ usernameOrEmail, password }) => {
        try {
            const res = await httpRequest.post(`/auth/signin`, { usernameOrEmail, password });

            if (res?.data?.token) {
                localStorage.setItem('jwt', res.data.token);
                Cookies.set('jwt', res.data.token);
            }

            return { status: res.status, data: res.data };
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            return error.response;
        }
    };

    const signUp = async (data) => {
        try {
            const res = await httpRequest.post(`/auth/signup`, data);
            return { status: res.status, data: res.data };
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            return error.response;
        }
    };

    const logout = async () => {
        try {
            const res = await httpRequest.post(`/auth/logout`, {});
            Cookies.remove('jwt');
            localStorage.removeItem('jwt');
            return { status: res.status, data: res.data };
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
            return error.response;
        }
    };

    const updateUser = async (username, avatar) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.post(`/auth/update/user`, { newUsername: username, newAvatar: avatar }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            console.log(res);
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
        }
    };

    const updatePassword = async (password, newPassword) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.post(`/auth/update/password`, { password: password, newPassword: newPassword }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
        }
    };

    const resetPassword = async (usernameOrEmail) => {
        try {
            const res = await httpRequest.post(`/auth/reset-password`, { usernameOrEmail });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
        }
    }

    const getRole = () => {
        try {
            const token = Cookies.get('jwt');
            const decode = jwtDecode(token);
            const roleId = Number(decode.roleId);
            return roleId;
        } catch (error) {
            console.log(error);
        }
    };

    const getProfile = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get(`/auth/user`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            const user = res.data.user;
            return { status: res.status, username: user.username, id: user.id, email: user.email, avatar: user.avatar };
        } catch (error) {
            console.log(error);
        }
    }

    const addFavorite = async (storyId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.post(`/auth/add-favorite/${storyId}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
        }
    }

    const getFavorite = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get(`/auth/get-favorite`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFavorite = async (storyId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.post(`/auth/delete-favorite/${storyId}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
        }
    }

    return {
        login,
        signUp,
        logout,
        updateUser,
        updatePassword,
        resetPassword,
        getRole,
        getProfile,
        addFavorite,
        getFavorite,
        deleteFavorite
    };
};

export default useAuthApi;
