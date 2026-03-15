import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import genreApi from '../../services/genreServices';
import Header from '../header/Header';

const PostGenre = () => {
    const navigate = useNavigate();
    const { getGenre, addGenre } = chapterApi();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tiêu đề sách', { autoClose: 1000 });
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Vui lòng nhập tên tác giả', { autoClose: 1000 });
            return;
        }

        setIsLoading(true);
        try {
            const response = await addGenre(formData);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                navigate(`/`);
            }else{
                toast.error(response.data.message, {autoClose: 1000});
                navigate(0);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm chương mới', { autoClose: 1000 });
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
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Thêm chương mới</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tiêu đề */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên thể loại
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                    placeholder="Tiêu đề"
                                    required
                                />
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
                                    rows="14"
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                    placeholder="Nội dung"
                                    required
                                />
                            </div>

                            {/* Nút đăng sách */}
                            <button
                                type="submit"
                                className="w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-secondaryOne transition-colors"
                            >
                                Thể loại mới
                            </button>
                            <div className="flex justify-center">
                                <a
                                    href={`/`}
                                    className="text-secondary hover:text-secondaryOne transition-colors"
                                >
                                    Quay lại
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostGenre; 