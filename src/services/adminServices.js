import httpRequest from '../utils/httpRequest';
import Cookies from 'js-cookie';

const useAdminApi = () => {
    // User Management APIs
    const getAllUsers = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get('/admin/users', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            //console.log(res);
            return { status: res.status, data: res.data.users };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const getUserById = async (userId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get(`/admin/users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const addAdminRole = async (userId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get(`/admin/users/${userId}/role`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const deleteAdminRole = async (userId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get(`/admin/users/${userId}/delete-role`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const deleteUser = async (userId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.delete(`/admin/users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // Story Management APIs
    const getAllStories = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get('/admin/stories', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data.stories };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const updateStory = async (storyId, storyData) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.put(`/admin/stories/${storyId}`, storyData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const deleteStory = async (storyId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.delete(`/admin/stories/${storyId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const getPendingStories = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get('/admin/stories/pending', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const approveStory = async (storyId) => {
        try {
            const token = Cookies.get('jwt');
            //console.log(storyId);
            const res = await httpRequest.post(`/admin/stories/approve/${storyId}`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const dropStory = async (storyId) => {
        try {
            const token = Cookies.get('jwt');
            //console.log(storyId);
            const res = await httpRequest.post(`/admin/stories/drop/${storyId}`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // Chapter Management APIs
    const getAllChapters = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get('/admin/chapters', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data.chapters };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const updateChapter = async (chapterId, chapterData) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.put(`/admin/chapters/${chapterId}`, chapterData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const deleteChapter = async (chapterId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.delete(`/admin/chapters/${chapterId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const getPendingChapters = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get('/admin/chapters/pending', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const approveChapter = async (chapterId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.put(`/admin/chapters/${chapterId}/approve`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const dropChapter = async (chapterId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.put(`/admin/chapters/${chapterId}/drop`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data.comments };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // Comment Management APIs
    const getAllComments = async () => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get('/admin/comments', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data.comments };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const getCommentById = async (commentId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.get(`/admin/comments/${commentId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const token = Cookies.get('jwt');
            const res = await httpRequest.delete(`/admin/comments/${commentId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    return {
        getAllUsers,
        getUserById,
        addAdminRole,
        deleteAdminRole,
        deleteUser,

        getAllStories,
        getPendingStories,
        approveStory,
        dropStory,

        getAllChapters,
        getPendingChapters,
        approveChapter,
        dropChapter,

        getAllComments,
        getCommentById,
        deleteComment
    };
};

export default useAdminApi; 