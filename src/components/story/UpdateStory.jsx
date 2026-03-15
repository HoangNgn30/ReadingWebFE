import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import genreApi from '../../services/genreServices';
import storyApi from '../../services/storyServices';
import Header from '../header/Header';

const PostStory = () => {
    const navigate = useNavigate();
    const { getGenre } = genreApi();
    const { updateStory, getStoryById } = storyApi();
    const [isLoading, setIsLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        authorName: '',
        description: '',
        status: '',
        genre: '',
        avatar: '',
    });

    const { storyId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genresResponse, storyResponse] = await Promise.all([
                    getGenre(),
                    storyId ? getStoryById(storyId) : Promise.resolve(null),
                ]);

                if (genresResponse.status === 200) {
                    setGenres(genresResponse.data.listGenres);
                }

                if (storyResponse && storyResponse.status === 200) {
                    //console.log(storyResponse);
                    setFormData({
                        title: storyResponse.data.story.title || '',
                        authorName: storyResponse.data.story.authorName || '',
                        description: storyResponse.data.story.description || '',
                        status: storyResponse.data.story.status || '',
                        genre: storyResponse.data.story.genre || '',
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error('Không thể tải dữ liệu', { autoClose: 1000 });
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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

        setIsLoading(true);
        //console.log(formData);
        try {
            const response = await updateStory(storyId, formData);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                navigate('/managed-story');
            } else {
                toast.error(response.data.message, { autoClose: 1000 });
                navigate(0);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi chỉnh sửa', { autoClose: 3000 });
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
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Chỉnh sửa</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tiêu đề */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
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

                            {/* Ảnh đại diện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="avatar"
                                    onChange={handleFileChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                />
                            </div>

                            {/* Tên tác giả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
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

                            <div className="flex gap-4">
                                {/* Thể loại */}
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
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

                                {/* Trạng thái */}
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                        required
                                    >
                                        <option value="Đang ra">Đang ra</option>
                                        <option value="Hoàn thành">Hoàn thành</option>
                                    </select>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
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
                                {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostStory;
