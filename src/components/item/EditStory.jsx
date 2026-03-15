import { useNavigate } from 'react-router-dom';

const EditStory = ({ story, handleDelete }) => {
    const navigate = useNavigate();

    const handleAuthorClick = (authorName) => {
        const safeAuthorName = authorName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        navigate(`/author/${safeAuthorName}`, {
            state: { originalAuthorName: authorName }
        });
    };

    return (
        <div className="flex flex-col items-center bg-bgColor p-4 rounded-xl shadow-md">
            <div className="w-40 h-56 overflow-hidden rounded-lg shadow-lg">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
            </div>

            <div className="mt-3 text-center">
                <a href={`/story/${story.id}`}>
                    <h4 className="font-bold text-lg line-clamp-1">{story.title}</h4>
                </a>
                <button
                    type="button"
                    className="text-sm text-black hover:underline hover:text-secondary transition-colors"
                    onClick={() => handleAuthorClick(story.authorName)}
                >
                    {story.authorName}
                </button>
                <p className="text-sm text-black">{story.genre}</p>
                <p className="text-sm text-black">{story.status}</p>
            </div>
            <div className="flex justify-end space-x-2">
                <a
                    href={`/update-story/${story.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                    Sửa
                </a>
                <button
                    onClick={() => handleDelete(story.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                >
                    Xóa
                </button>
            </div>
        </div>
    )
};

export default EditStory;
