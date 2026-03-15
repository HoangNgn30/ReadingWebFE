import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import chapterApi from '../../services/chapterServices';
import Header from '../header/Header';

const ChapterInfo = () => {
    const { storyId, chapterNumber } = useParams();
    const { getChapter } = chapterApi();
    const [story, setStory] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState({
        background: 'Default',
        font: 'roboto',
        size: '20px',
    });

    useEffect(() => {
        fetchChapterDetails();
        const saved = localStorage.getItem('chapterSettings');
        if (saved) setSettings(JSON.parse(saved));
    }, [chapterNumber]);

    useEffect(() => {
        localStorage.setItem('chapterSettings', JSON.stringify(settings));
    }, [settings]);

    const fetchChapterDetails = async () => {
        try {
            const response = await getChapter(storyId, chapterNumber);
            if (response.status === 200) {
                setChapter(response.data.chapter);
                setStory(response.data.story);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Không thể tải nội dung chương', { autoClose: 1000 });
        } finally {
            setIsLoading(false);
        }
    };

    const getBgColor = () => {
        switch (settings.background) {
            case 'dark':
                return 'bg-[#232733]';
            case 'light':
                return 'bg-white';
            case 'yellow':
                return 'bg-[#fff8dc]';
            default:
                return 'bg-bgColor';
        }
    };
    const getFontFamily = () => {
        switch (settings.font) {
            case 'arial':
                return 'font-sans';
            case 'times':
                return 'font-serif';
            default:
                return 'font-roboto';
        }
    };
    const getFontSize = () => settings.size;

    const getContentBgColor = () => {
        switch (settings.background) {
            case 'dark':
                return 'bg-[#232733]';
            case 'light':
                return 'bg-white';
            case 'yellow':
                return 'bg-[#fff8dc]';
            default:
                return 'bg-white';
        }
    };

    const getTextColor = () => {
        return settings.background === 'dark' ? 'text-white' : 'text-black';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy nội dung chương</p>
            </div>
        );
    }

    const prevChapter = chapter.chapterNumber > 1 ? chapter.chapterNumber - 1 : null;
    const nextChapter = chapter.chapterNumber < story.lastestChapterId ? chapter.chapterNumber + 1 : null;

    return (
        <>
            <Header settings={settings} onChangeSettings={setSettings} />
            <div className={`min-h-screen ${getBgColor()} mt-20`}>
                <div className="container mx-auto px-4 py-8">
                    {/* Tiêu đề chương */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{story.title}</h1>
                        <p className="text-lg text-gray-900">
                            Chương {chapter.chapterNumber}: {chapter.title}
                        </p>
                    </div>

                    {/* Điều hướng chương */}
                    <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 mb-8">
                        <Link
                            to={prevChapter ? `/${storyId}/${prevChapter}` : '#'}
                            className={`px-4 py-2 rounded-lg transition-colors w-26 text-center ${
                                prevChapter
                                    ? 'bg-secondary text-white hover:bg-secondaryOne'
                                    : 'invisible opacity-0 pointer-events-none'
                            }`}
                        >
                            Chương trước
                        </Link>

                        <Link
                            to={`/story/${storyId}`}
                            className="px-4 py-2 text-secondary hover:text-secondaryOne transition-colors flex-grow text-center"
                        >
                            Mục lục
                        </Link>

                        <Link
                            to={nextChapter ? `/${storyId}/${nextChapter}` : '#'}
                            className={`px-4 py-2 rounded-lg transition-colors w-26 text-center ${
                                nextChapter
                                    ? 'bg-secondary text-white hover:bg-secondaryOne'
                                    : 'invisible opacity-0 pointer-events-none'
                            }`}
                        >
                            Chương sau
                        </Link>
                    </div>

                    {/* Nội dung chương */}
                    <div className={`${getContentBgColor()} rounded-lg shadow-md p-6 mb-8`} 
                        style={{
                            backgroundColor: settings.background.startsWith('#') ? settings.background : undefined
                        }}
                    >
                        <div className={`prose max-w-none ${getFontFamily()} ${getTextColor()}`}>
                            {chapter.content.split('\n').map((paragraph, index) => (
                                <p key={index} className={`mb-4 leading-relaxe ${getTextColor()}`} 
                                    style={{ 
                                        fontFamily:
                                            settings.font === 'arial'
                                                ? 'Arial, sans-serif'
                                                : settings.font === 'times'
                                                ? 'Times New Roman, serif'
                                                : 'Roboto, sans-serif',
                                        fontSize: `${settings.size}px` 
                                    }}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Điều hướng chương (Lặp lại dưới cùng) */}
                    <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4">
                        <Link
                            to={prevChapter ? `/${storyId}/${prevChapter}` : '#'}
                            className={`px-4 py-2 rounded-lg transition-colors w-26 text-center ${
                                prevChapter
                                    ? 'bg-secondary text-white hover:bg-secondaryOne'
                                    : 'invisible opacity-0 pointer-events-none'
                            }`}
                        >
                            Chương trước
                        </Link>

                        <Link
                            to={`/story/${storyId}`}
                            className="px-4 py-2 text-secondary hover:text-secondaryOne transition-colors flex-grow text-center"
                        >
                            Mục lục
                        </Link>

                        <Link
                            to={nextChapter ? `/${storyId}/${nextChapter}` : '#'}
                            className={`px-4 py-2 rounded-lg transition-colors w-26 text-center ${
                                nextChapter
                                    ? 'bg-secondary text-white hover:bg-secondaryOne'
                                    : 'invisible opacity-0 pointer-events-none'
                            }`}
                        >
                            Chương sau
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterInfo;
