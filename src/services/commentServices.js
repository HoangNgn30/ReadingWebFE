import httpRequest from "../utils/httpRequest";
import Cookie from "js-cookie";

const commentApi = () => {
    const postComment = async (storyId, content) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/auth/post-comment/${storyId}`, { content }, {
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

    const updateComment = async (commentId, content) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/auth/update-comment/${commentId}`, { content }, {
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

    const deleteComment = async (commentId) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/auth/delete-comment/${commentId}`, {}, {
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

    const getComment = async () => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.get(`/auth/get-comment`, {}, {
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

    const getAllComments = async (storyId, page) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.get(`/auth/comments/${storyId}/${page}`, {}, {
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

    return {
        postComment,
        updateComment,
        deleteComment,
        getComment,
        getAllComments
    };
}

export default commentApi;