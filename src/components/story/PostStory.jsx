import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import genreApi from '../../services/genreServices';
import storyApi from '../../services/storyServices';
import Header from '../header/Header';

const PostStory = () => {
    const navigate = useNavigate();
    const { getGenre } = genreApi();
    const { postStory } = storyApi();
    const [isLoading, setIsLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        authorName: '',
        description: '',
        genre: '',
        avatar: null,
    });

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await getGenre();
                if (response.status === 200) {
                    setGenres(response.data.listGenres);
                } else {
                    toast.error(response.data.message, {autoClose: 1000});
                }
            } catch (error) {
                toast.error('Không thể tải danh sách thể loại', { autoClose: 3000 });
            }
        };

        fetchGenres();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev,
                    avatar: reader.result,
                }));
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề sách', { autoClose: 3000 });
            return;
        }
        if (!formData.authorName.trim()) {
            toast.error('Vui lòng nhập tên tác giả', { autoClose: 3000 });
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Vui lòng nhập mô tả sách', { autoClose: 3000 });
            return;
        }
        if (!formData.genre) {
            toast.error('Vui lòng chọn thể loại', { autoClose: 3000 });
            return;
        }

        setIsLoading(true);
        try {
            const response = await postStory(formData);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 3000 });
                navigate("/managed-story");
            }else{
                toast.error(response.data.message, {autoClose: 1000});
                navigate(0);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng sách', { autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header></Header>
            <div className="min-h-screen bg-bgColor mt-12 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-bgColorOne rounded-2xl p-8 shadow-xl">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng sách mới</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Ảnh đại diện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh đại diện 
                                </label>
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="avatar/*"
                                    onChange={handleFileChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900"
                                />
                            </div>

                            {/* Tiêu đề */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề sách
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                    placeholder="Nhập tiêu đề sách"
                                    required
                                />
                            </div>

                            {/* Tên tác giả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên tác giả
                                </label>
                                <input
                                    type="text"
                                    name="authorName"
                                    value={formData.authorName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                    placeholder="Nhập tên tác giả"
                                    required
                                />
                            </div>

                            {/* Ảnh đại diện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh đại diện
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="avatar"
                                    onChange={handleFileChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                />
                            </div>

                            {/* Thể loại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thể loại
                                </label>
                                <select
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                    required
                                >
                                    <option value="">Chọn thể loại</option>
                                    {genres.map((genre) => (
                                        <option key={genre.id} value={genre.name}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                    placeholder="Nhập mô tả sách"
                                    required
                                />
                            </div>

                            {/* Nút đăng sách */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-lg bg-secondary py-3 text-white transition-colors hover:bg-secondaryOne hover:text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đăng sách'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostStory; 