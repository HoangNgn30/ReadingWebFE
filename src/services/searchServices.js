import httpRequest from "../utils/httpRequest";

const searchApi = () => {
    const searchByKeyword = async (order, page, keyword) => {
        try {
            // Đảm bảo keyword không rỗng
            if (!keyword || keyword.trim() === '') {
                throw new Error('Từ khóa tìm kiếm không được để trống');
            }

            // Log để debug
            console.log('Search params:', { order, page, keyword });

            // Gọi API với endpoint chính xác
            const res = await httpRequest.post(`/search/keyword/${order}/${page}`, { 
                keyword: keyword 
            });

            // Log response để debug
            console.log('Search API response:', res);

            if (!res) {
                throw new Error('Không có phản hồi từ server');
            }

            // Kiểm tra cấu trúc response
            if (res.status === 200) {
                // Kiểm tra xem có dữ liệu stories trong response không
                if (res.data && res.data.stories) {
                    return {
                        status: res.status,
                        data: res.data
                    };
                } else if (res.data && res.data.pagination) {
                    // Nếu chỉ có pagination, trả về mảng stories rỗng
                    return {
                        status: res.status,
                        data: {
                            stories: [],
                            pagination: res.data.pagination
                        }
                    };
                }
            }

            // Nếu không match với cấu trúc nào, log chi tiết và throw error
            console.error('Invalid response structure:', res);
            throw new Error('Cấu trúc dữ liệu không hợp lệ');
        } catch (error) {
            console.error('Search API error:', error);
            return {
                status: error.response?.status || 500,
                error: error.response?.data?.message || error.message || 'Lỗi khi tìm kiếm'
            };
        }
    };

    const searchByGenre = async (order, page, genreName) => {
        try {
            const res = await httpRequest.post(`/search/genre/${genreName}/${order}/${page}`, {});
            return { status: res.status, data: res.data };
        } catch (error) {
            console.error('Search by genre error:', error);
            return {
                status: error.response?.status || 500,
                error: error.response?.data?.message || error.message || 'Lỗi khi tìm kiếm theo thể loại'
            };
        }
    };

    return {
        searchByKeyword,
        searchByGenre
    };
};

export default searchApi;