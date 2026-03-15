import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import genreApi from '../../services/genreServices';
import { toast } from 'react-toastify';

const GenreDropdown = () => {
    const [genres, setGenres] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { getGenre } = genreApi();
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await getGenre();
                if (response.status === 200) {
                    setGenres(response.data.listGenres);
                }
            } catch (error) {
                toast.error('Không thể tải danh sách thể loại', { autoClose: 3000 });
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    return (
        <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to="/categories" className="medium-16 text-black hover:text-secondary hover:underline">
                Thể loại
            </Link>
            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-lg shadow-lg py-4 z-50 border border-gray-200"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="grid grid-cols-3 gap-2 px-4">
                        {genres.map((genre) => (
                            <Link
                                key={genre.id}
                                to={`/books?genre=${genre.id}`}
                                className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
                                title={genre.name}
                            >
                                {genre.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenreDropdown;
