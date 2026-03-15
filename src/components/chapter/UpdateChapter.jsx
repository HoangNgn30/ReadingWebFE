import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import chapterApi from '../../services/chapterServices';
import Header from '../header/Header';

const UpdateChapter = () => {
    const navigate = useNavigate();
    const { addChapter, getChapter } = chapterApi();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    useEffect(() => {
        fetchChapter();
    }, []);

    const {storyId, chapterNumber} = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchChapter = async () => {
        try {
            const response = await getChapter(storyId, chapterNumber);
            const chapter = response.data.chapter;

            if (response.status === 200) {
                setFormData({
                    title: chapter.title,
                    content: chapter.content
                });
            }else
                toast.error(response.data.message, {autoClose: 500});
            //console.log(chapter.title, chapter.content);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải dữ liệu', { autoClose: 1000 });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const response = await addChapter(storyId, formData);
            if (response.status === 200) {
                toast.success(response.data.message, { autoClose: 1000 });
                navigate(`/story/${storyId}`);
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
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:border-green-800 focus:ring-2 focus:ring-green-800"
                                    placeholder="Tiêu đề"
                                    required
                                />
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
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
                                Cập nhật
                            </button>
                            <div className="flex justify-center">
                                <a
                                    href={`/story/${storyId}`}
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

export default UpdateChapter; 
