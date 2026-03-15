import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import genreApi from '../../services/genreServices';
import { toast } from 'react-toastify';

const Categories = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await genreApi().getGenre();
                console.log('API Response:', response);

                if (response?.status === 200 && response?.data) {
                    // Kiểm tra cấu trúc dữ liệu
                    console.log('Genre Data:', response.data);

                    // Nếu dữ liệu nằm trong một thuộc tính khác (ví dụ: listGenres)
                    const genreList = response.data.listGenres || response.data;
                    console.log('Processed Genre List:', genreList);

                    setGenres(genreList);
                } else {
                    throw new Error('Không thể lấy dữ liệu thể loại');
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu thể loại:', error);
                toast.error('Không thể tải danh sách thể loại');
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Thể loại</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {genres.map((genre) => (
                    <Link
                        key={genre.id}
                        to={`/books?genre=${genre.id}`}
                        className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-lg font-semibold">{genre.name}</h2>
                        {genre.description && <p className="text-gray-600 mt-2 text-sm">{genre.description}</p>}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
