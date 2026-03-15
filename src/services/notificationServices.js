import httpRequest from "../utils/httpRequest";
import Cookie from "js-cookie";

const notificationApi = () => {
    const getNotification = async () => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.get(`/auth/get-notification`, {}, {
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

    const readNotification = async (notificationId) => {
        try {
            const token = Cookie.get('jwt');
            const res = await httpRequest.get(`/auth/read-notification/${notificationId}`, {}, {
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
        getNotification,
        readNotification
    };
};

export default notificationApi;