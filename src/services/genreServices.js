import httpRequest from "../utils/httpRequest";
import Cookie from "js-cookie";

const genreApi = () => {
    const addGenre = async (name, description) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/genre/add-genre`, { name, description }, {
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

    const deleteGenre = async (name) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.post(`/genre/delete-genre`, { name }, {
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

    const getGenre = async () => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.get(`/genre/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            //console.log('Genre API Response:', res);
            return { status: res.status, data: res.data };
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    };

    return {
        addGenre,
        deleteGenre,
        getGenre,
    };
}

export default genreApi;