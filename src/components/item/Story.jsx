import { useNavigate } from 'react-router-dom';

const Story = ({ story }) => {
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
        <> 
            <div className="flex flex-col items-center bg-bgColor p-4 rounded-xl shadow-md">
                <div className="w-40 h-56 overflow-hidden rounded-lg shadow-lg">
                    <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                </div>

                <div className="mt-3 text-center">
                    <h4 className="font-bold text-lg line-clamp-1">{story.title}</h4>
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
            </div>
        </>
    )
};

export default Story;
