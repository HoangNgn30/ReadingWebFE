import httpRequest from "../utils/httpRequest";
import Cookie from "js-cookie";

const favoriteApi = () => {
    const addFavorite = async (storyId) => {
        try {
            const token = Cookie.get('jwt');
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
    };

    const deleteFavorite = async (storyId) => {
        try {
            const token = Cookie.get('jwt');
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
    };

    const getFavorite = async () => {
        try {
            const token = Cookie.get('jwt');
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
    };

    return {
        addFavorite,
        deleteFavorite,
        getFavorite
    };
};

export default favoriteApi;