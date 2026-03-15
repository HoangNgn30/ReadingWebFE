import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import storyApi from '../../services/storyServices';
import useAuthApi from '../../services/authServices';
import Header from '../header/Header';
import commentApi from '../../services/commentServices';
import chapterApi from '../../services/chapterServices';
import { FaHeart, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuthorClick } from '../../utils/authorUtils';
import Footer from '../footer/Footer';

const StoryInfo = () => {
    const navigate = useNavigate();
    const { getStoryById, checkManager } = storyApi();
    const { getProfile, addFavorite, deleteFavorite, getFavorite } = useAuthApi();
    const { postComment } = commentApi();
    const { deleteChapter } = chapterApi();
    const [story, setStory] = useState([]);
    const [user, setUser] = useState(null);
    const [genre, setGenre] = useState();
    const [comments, setComments] = useState([]);
    const [isManager, setIsManager] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chapters'); 
    const [commentContent, setCommentContent] = useState('');
    const [isFollowing, setIsFollowing] = useState('');
    const [expanded, setExpanded] = useState(false);

    const { storyId } = useParams();
    const handleAuthorClick = useAuthorClick();

    useEffect(() => {
        fetchStoryDetails();
        fetchUser();
        fetchFollowed();
    }, [storyId]);

    const fetchStoryDetails = async () => {
        try {
            const response = await getStoryById(storyId);
            const isManager = await checkManager(storyId);
            setIsManager(isManager);
            //console.log(response.data);
            if (response.status === 200) {
                setStory(response.data.story);
                setComments(response.data.comments);
                setGenre(response.data.genre);
            } else {
                toast.error(response.data.message, { autoClose: 1000 });
            }
        } catch (error) {
            toast.error('Không thể tải thông tin sách', { autoClose: 1000 });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await getProfile();
            //console.log(response);
            const user = response;
            if(response.status === 200)
                setUser(user);
            else
                toast.error("Bạn cần đăng nhập để thực hiện hành động này", {autoClose: 500});
        } catch (error) {
            console.log(error);
        }
    }

    const fetchFollowed = async () => {
        try {
            const response = await getFavorite();
            //console.log(response.data.listStories);
            const listStories = response.data.listStories;
            const isInList = listStories.some(item => item.id == storyId);
            //console.log(isInList);
            if(isInList)
                setIsFollowing(true);
            else
                setIsFollowing(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddChapter = () => {
        navigate(`/add-chapter/${storyId}`);
    };

    const handlePostComment = async () => {
        if (!commentContent.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận', { autoClose: 1000 });
            return;
        }
        try {
            const response = await postComment(storyId, commentContent);
            if (response.status === 200) {
                //toast.success('Đăng bình luận thành công', { autoClose: 1000 });
                setCommentContent('');
                fetchStoryDetails(); // Load lại danh sách bình luận
            } else {
                toast.error(response.data.message || 'Đăng bình luận thất bại', { autoClose: 1000 });
            }
        } catch (error) {
            toast.error('Đăng bình luận thất bại', { autoClose: 1000 });
        }
    };

    const handleFollowed = async (storyId) => {
        try {
            if(!isFollowing){
                const response = await addFavorite(storyId);
                console.log(response);
                if(response.status === 200){
                    setIsFollowing(!isFollowing);
                    toast.success(response.data.message, {autoClose: 500});
                }
                else
                    toast.error("Bạn cần đăng nhập để thực hiện hành động này", {autoClose: 500});
            }else{
                const response = await deleteFavorite(storyId);
                console.log(response);
                if(response.status === 200){
                    setIsFollowing(!isFollowing);
                    toast.success(response.data.message, {autoClose: 500});
                }
                else
                    toast.error("Bạn cần đăng nhập để thực hiện hành động này", {autoClose: 500});
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteChapter = async (chapterNumber, e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete button
        if (!window.confirm('Bạn có chắc chắn muốn xóa chương này?')) {
            return;
        }

        try {
            const response = await deleteChapter(storyId, chapterNumber);
            if (response.status === 200) {
                toast.success('Xóa chương thành công', { autoClose: 500 });
                fetchStoryDetails(); // Refresh the story details
            }
        } catch (error) {
            toast.error('Không thể xóa chương', { autoClose: 500 });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy thông tin sách</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-bgColorOne to-bgColor mt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Phần thông tin cơ bản */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Ảnh bìa và nút theo dõi */}
                            <div className="relative group flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={story.image}
                                        alt={story.title}
                                        className="w-[220px] h-[293px] object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="hidden absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300"></div>
                                </div>
                                <button
                                    onClick={() => handleFollowed(story.id)}
                                    className={`mt-4 px-6 py-2 rounded-full transition-all duration-300 ${
                                        isFollowing 
                                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                                            : 'bg-secondary hover:bg-secondary/90 text-white'
                                    }`}
                                >
                                    {isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                                </button>
                            </div>

                            
                            {/* Thông tin sách */}
                            <div className="w-full md:w-2/3">
                                <h1 className="text-4xl font-bold text-gray-800 mb-6">{story.title}</h1>
                                <div className="space-y-4">
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold text-gray-800">Tác giả:</span>{' '}
                                        <button
                                            type="button"
                                            className="text-base text-black-700 hover:underline hover:text-secondary transition-colors font-semibold"
                                            onClick={() => handleAuthorClick(story.authorName)}
                                        >
                                            {story.authorName}
                                        </button>
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold text-gray-800">Thể loại:</span>{' '}
                                        <button
                                            type="button"
                                            className="text-base text-black-700 hover:underline hover:text-secondary transition-colors font-semibold"
                                            onClick={() => navigate(`/books?genre=${genre.id}`)}
                                        >
                                            {story.genre}
                                        </button>
                                    </p>
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold text-gray-800">Trạng thái:</span>{' '}
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                story.status === 'Hoàn thành'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {story.status}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className={`mt-6 text-gray-600 text-lg leading-relaxed transition-all duration-300 ${!expanded ? 'line-clamp-6' : ''}`}>
                                        {story.description}
                                    </p>

                                    {story.description.split(' ').length > 30 && (
                                        <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="mt-2 text-black-600 hover:underline focus:outline-none"
                                        >
                                        {expanded ? 'Ẩn bớt' : 'Xem thêm'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isManager && (
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => navigate(`/update-story/${story.id}`)}
                                    className="px-6 py-3 bg-secondary text-white rounded-lg  transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Cập nhật thông tin sách
                                </button>
                                <button
                                    onClick={() => handleAddChapter()}
                                    className="px-6 py-3 bg-secondaryOne text-black rounded-lg  transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Thêm chương mới
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tab chương và bình luận */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="flex">
                                    <button
                                        className={`px-8 py-4 text-base font-medium transition-all duration-300 ${
                                            activeTab === 'chapters'
                                                ? 'text-secondary border-b-2 border-secondary'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        onClick={() => setActiveTab('chapters')}
                                    >
                                        Danh sách chương
                                    </button>
                                    <button
                                        className={`px-8 py-4 text-base font-medium transition-all duration-300 ${
                                            activeTab === 'comments'
                                                ? 'text-secondary border-b-2 border-secondary'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        onClick={() => setActiveTab('comments')}
                                    >
                                        Bình luận
                                    </button>
                                        {isManager && (<button
                                            className={`px-8 py-4 text-base font-medium transition-all duration-300 ${
                                                activeTab === 'pendingChapters'
                                                    ? 'text-secondary border-b-2 border-secondary'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                            onClick={() => setActiveTab('pendingChapters')}
                                        >
                                            Chương chưa duyệt
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {activeTab === 'chapters' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {story.Chapters?.filter(chapter => chapter.isApproved == true).length === 0 ? (
                                        <p className="text-gray-500">Không có chương.</p>
                                    ) : (
                                        story.Chapters?.filter(chapter => chapter.isApproved == true).map((chapter) => (
                                            <div
                                                key={chapter.id}
                                                className="p-5 bg-white rounded-lg hover:bg-bgColor transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-md"
                                            >
                                                <div 
                                                    className="flex justify-between items-start mb-2"
                                                    onClick={() => navigate(`/${storyId}/${chapter.chapterNumber}`)}
                                                >
                                                    <h3 className="font-medium text-gray-800 text-lg">
                                                        Chương {chapter.chapterNumber}: {chapter.title}
                                                    </h3>
                                                    {isManager && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/update-chapter/${storyId}/${chapter.chapterNumber}`)
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    navigate(`/insert-chapter/${storyId}`, {
                                                                        state: {
                                                                            afterChapterNumber: chapter.chapterNumber
                                                                        }
                                                                    });
                                                                }}
                                                                className="text-green-600 hover:text-green-800"
                                                                title="Thêm chương"
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteChapter(chapter.chapterNumber, e)}
                                                                className="text-red-600 hover:text-red-800"
                                                                title="Xóa"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Đăng ngày: {new Date(chapter.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : activeTab === 'comments' ? (
                                <div className="space-y-6">
                                    {/* Ô nhập bình luận */}
                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={
                                                    user.avatar == null ? 'https://i.imgur.com/0y0y0y0.png' : user.avatar
                                                }
                                                alt="avatar"
                                                className="w-12 h-12 rounded-full border-2 border-gray-200"
                                            />
                                            <div className="flex-1">
                                                <textarea
                                                    className="w-full p-4 border border-gray-200 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
                                                    rows="3"
                                                    placeholder="Viết bình luận của bạn..."
                                                    value={commentContent}
                                                    onChange={(e) => setCommentContent(e.target.value)}
                                                ></textarea>
                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={handlePostComment}
                                                        className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Đăng bình luận
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Danh sách bình luận */}
                                    <div className="space-y-6">
                                        {comments.length === 0 ? (
                                            <div>Chưa có bình luận nào.</div>
                                        ) : (
                                            comments.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="bg-white rounded-lg p-6 border border-gray-200"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <img
                                                            src={comment.Users.avatar}
                                                            alt={comment.Users.username}
                                                            className="w-12 h-12 rounded-full border-2 border-gray-200"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div>
                                                                    <p className="font-medium text-gray-800">
                                                                        {comment.Users.username}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {new Date(comment.createdAt).toLocaleDateString(
                                                                            'vi-VN',
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-700">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                isManager && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {story.Chapters?.filter(chapter => chapter.isApproved == false).length === 0 ? (
                                            <p className="text-gray-500">Không có chương chưa duyệt.</p>
                                        ) : (
                                            story.Chapters?.filter(chapter => chapter.isApproved == false).map((chapter) => (
                                                <div
                                                    key={chapter.id}
                                                    className="p-5 bg-white rounded-lg hover:bg-bgColor transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-md"
                                                >
                                                    <div 
                                                        className="flex justify-between items-start mb-2"
                                                        onClick={() => navigate(`/${storyId}/${chapter.chapterNumber}`)}
                                                    >
                                                        <h3 className="font-medium text-gray-800 text-lg">
                                                            Chương {chapter.chapterNumber}: {chapter.title}
                                                        </h3>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/update-chapter/${storyId}/${chapter.chapterNumber}`)
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteChapter(chapter.chapterNumber, e)}
                                                                className="text-red-600 hover:text-red-800"
                                                                title="Xóa"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        Đăng ngày: {new Date(chapter.createdAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
            </div>
            <Footer/>
        </>
    );
};

export default StoryInfo;
