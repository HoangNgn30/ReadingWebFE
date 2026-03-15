import httpRequest from "../utils/httpRequest";
import Cookie from "js-cookie";

const chapterApi = () => {
    const addChapter = async (storyId, { title, content }) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/chapter/post-chapter/${storyId}`, { title, content }, {
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

    const updateChapter = async (storyId, chapterNumber, formData) => {
        try {
            const token = Cookie.get('jwt');
            const { title, content } = formData;
            const res = await httpRequest.post(`/chapter/update-chapter/${storyId}/${chapterNumber}`, { title, content }, {
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

    const insertChapter = async (storyId, { title, content, afterChapterNumber }) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/chapter/insert-chapter/${storyId}`, { title, content, afterChapterNumber }, {
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


    const deleteChapter = async (storyId, chapterNumber) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/chapter/delete-chapter/${storyId}/${chapterNumber}`, {}, {
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

    const getChapter = async (storyId, chapterNumber) => {
        try {
            const res = await httpRequest.get(`/chapter/${storyId}/${chapterNumber}`, {});
            return { status: res.status, data: res.data };
        } catch (error) {
            console.log(error);
        }
    }

    return {
        addChapter,
        updateChapter,
        deleteChapter,
        getChapter,
        insertChapter
    };
};

export default chapterApi;