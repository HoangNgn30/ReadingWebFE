import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import genreApi from '../../services/genreServices';
import searchApi from '../../services/searchServices';
import { toast } from 'react-toastify';
import { LucideSettings2 } from 'lucide-react';
import { RiSearch2Line, RiCloseLine } from 'react-icons/ri';
import Title from '../home/Title';
import Item from '../item/Item';
import Footer from '../footer/Footer';
import storyApi from '../../services/storyServices';

const Books = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getStory, getStoryByGenre } = storyApi();
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [genres, setGenres] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]); // Store all books for filtering
    const [totalPages, setTotalPages] = useState(1);
    const [filteredBooks, setFilteredBooks] = useState([]); // Store filtered books
    const { getGenre } = genreApi();
    const [sortOption, setSortOption] = useState('updatedAt');
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // Function to normalize text for searching (remove accents and convert to lowercase)
    const normalizeText = (text) => {
        if (!text) return '';
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    // Custom filter function
    const filterBooks = (books, searchTerm) => {
        if (!searchTerm || !books) return books || [];
        
        const normalizedSearchTerm = normalizeText(searchTerm);
        
        return books.filter(book => {
            if (!book) return false;
            
            const normalizedTitle = normalizeText(book.title);
            const normalizedAuthor = normalizeText(book.author);
            
            return normalizedTitle.includes(normalizedSearchTerm) || 
                   normalizedAuthor.includes(normalizedSearchTerm);
        });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const genreId = searchParams.get('genre');
        if (genreId) {
            setSelectedGenre(Number(genreId));
            fetchBooksByGenre(currentPage, genreId, 'updatedAt');
        } else {
            fetchBooks(currentPage);
        }
    }, [location.search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page when searching
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const clearSearch = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setIsSearching(false);
        setSearchError(null);
        setFilteredBooks(allBooks);
    };

    const fetchBooks = async (page) => {
        try {
            const response = await getStory(page);
            if (response.status === 200) {
                setBooks(response.data);
                setAllBooks(response.data); // Store all books
                setFilteredBooks(response.data); // Initialize filtered books
                setTotalPages(response.pagination.totalPages);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    const fetchBooksByGenre = async (page, genreId, sortOption) => {
        try {
            const response = await getStoryByGenre(page, genreId, sortOption);
            if (response.status === 200) {
                setBooks(response.data);
                setAllBooks(response.data); // Store all books
                setFilteredBooks(response.data); // Initialize filtered books
                setTotalPages(response.pagination.totalPages);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error('Error fetching stories by genre:', error);
        }
    };

    // Add useEffect for pagination
    useEffect(() => {
        if (selectedGenre) {
            fetchBooksByGenre(currentPage, selectedGenre, 'updatedAt');
        } else {
            fetchBooks(currentPage);
        }
    }, [currentPage]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await getGenre();
                if (response.status === 200) {
                    setGenres(response.data.listGenres);
                }
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    // Update search useEffect to use local filtering
    useEffect(() => {
        const performSearch = () => {
            setSearchError(null);

            if (!debouncedSearchTerm || debouncedSearchTerm.trim() === '') {
                setIsSearching(false);
                setFilteredBooks(allBooks);
                return;
            }

            setIsSearching(true);
            const filtered = filterBooks(allBooks, debouncedSearchTerm.trim());
            setFilteredBooks(filtered);

            if (filtered.length === 0) {
                // toast.info(`Không tìm thấy kết quả nào cho "${debouncedSearchTerm}"`);
            }
        };

        performSearch();
    }, [debouncedSearchTerm, allBooks]);

    // Add console.log to debug search results
    useEffect(() => {
        // if (isSearching) {
        //     console.log('Current search results:', {
        //         searchTerm: debouncedSearchTerm,
        //         books: books,
        //         totalPages: totalPages,
        //         currentPage: currentPage,
        //     });
        // }
    }, [books, isSearching, debouncedSearchTerm, totalPages, currentPage]);

    // Sort filteredBooks when sortOption changes
    useEffect(() => {
        let sortedBooks = [...filteredBooks];
        if (sortOption === 'createdAt') {
            sortedBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOption === 'views') {
            sortedBooks.sort((a, b) => (b.views || 0) - (a.views || 0));
        }
        setFilteredBooks(sortedBooks);
    }, [sortOption]);

    const handleGenreClick = (genreId) => {
        if (isSearching) {
            // Clear search when changing genre
            setSearchTerm('');
            setDebouncedSearchTerm('');
            setIsSearching(false);
        }
        setSelectedGenre(genreId == selectedGenre ? null : genreId);
        setCurrentPage(1); // Reset to first page when changing genre
        if (genreId === selectedGenre) {
            fetchBooks(currentPage);
        } else {
            fetchBooksByGenre(currentPage, genreId, sortOption);
        }
    };

    const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name || 'Tất cả';

    // Update handleSortChange
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1); 
    };

    // Update function to handle author click
    const handleAuthorClick = (authorName) => {
        // Convert Vietnamese characters to URL-safe format
        const safeAuthorName = authorName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[đĐ]/g, 'd') // Replace đ/Đ with d
            .replace(/[^a-z0-9]/g, '-') // Replace other special chars with hyphen
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

        // Navigate using React Router instead of window.location
        navigate(`/author/${safeAuthorName}`, { 
            state: { originalAuthorName: authorName } // Pass original name in state
        });
    };

    // Lọc local theo keyword (title hoặc authorName)
    useEffect(() => {
        if (!debouncedSearchTerm || debouncedSearchTerm.trim() === '') {
            setFilteredBooks(books);
            return;
        }
        const keyword = normalizeText(debouncedSearchTerm.trim());
        const filtered = books.filter(book => {
            const title = normalizeText(book.title);
            const author = normalizeText(book.authorName);
            return title.includes(keyword) || author.includes(keyword);
        });
        setFilteredBooks(filtered);
    }, [debouncedSearchTerm, books]);

    return (
        <>
            <section className="max-padd-container bg-bgColor">
                <div className="pt-28">
                    {/* search box */}
                    <div className="w-full max-w-2xl flexCenter">
                        <div className="inline-flex items-center justify-center bg-primary overflow-hidden w-full rounded-full p-4 px-5 border border-black">
                            <div className="text-lg cursor-pointer">
                                <RiSearch2Line />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm truyện theo tên hoặc tác giả..."
                                className="border-none outline-none w-full text-sm pl-4 bg-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={isLoading}
                            />
                            {(searchTerm || isLoading) && (
                                <button
                                    onClick={clearSearch}
                                    className="text-lg cursor-pointer hover:text-secondary transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-secondary"></div>
                                    ) : (
                                        <RiCloseLine />
                                    )}
                                </button>
                            )}
                            <div className="flexCenter cursor-pointer text-lg border-1 pl-2">
                                <LucideSettings2 />
                            </div>
                        </div>
                    </div>

                    {/* Search status */}
                    {isSearching && (
                        <div className="text-center mt-4">
                            {isLoading ? (
                                <p className="text-text1">Đang tìm kiếm...</p>
                            ) : searchError ? (
                                <p className="text-red-500">{searchError}</p>
                            ) : (
                                <p className="text-text1">
                                    {filteredBooks.length > 0
                                        ? `Tìm thấy ${filteredBooks.length} kết quả cho "${debouncedSearchTerm}"`
                                        : `Không tìm thấy kết quả nào cho "${debouncedSearchTerm}"`}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Categories */}
                    <div className="mt-12 mb-16">
                        <h4 className="h4 mb-4 hidden sm:flex">Thể loại:</h4>
                        <div className="flexCenter sm:flexStart flex-wrap gap-x-12 gap-y-4">
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    onClick={() => handleGenreClick(genre.id)}
                                    className={`px-4 py-2 bg-bgColor rounded-full text-text1 hover:bg-secondary hover:text-white transition-colors duration-200 border border-black ${
                                        selectedGenre === genre.id ? 'bg-secondary text-white' : ''
                                    }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title and Sort in one row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-16 max-sm:flexCenter text-center mt-8">
                        <Title
                            title1={'Danh mục '}
                            title2={'Sách'}
                            titleStyles={'pb-0 text-start'}
                            para={selectedGenre ? `Thể loại: ${selectedGenreName}` : 'Tất cả sách'}
                            paraStyles={'!block text-gray-30'}
                        />
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-lg sm:text-xl">Sắp xếp theo:</span>
                            <select
                                className="text-base sm:text-lg p-2.5 rounded-lg outline-none bg-primary text-gray-30 rounded border border-gray-300"
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value="createdAt">Mới nhất</option>
                                <option value="views">Xem nhiều nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Books container  */}
                    <div className="mt-8">
                        {/* Books  */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <div key={book.id} className="relative">
                                        <Item book={book} />
                                        {book.author && (
                                            <div className="mt-2 text-center">
                                                <button
                                                    onClick={() => handleAuthorClick(book.author)}
                                                    className="text-sm text-secondary hover:text-primary transition-colors"
                                                >
                                                    Xem thêm truyện của {book.author}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-text1 text-lg">
                                        {debouncedSearchTerm
                                            ? `Không tìm thấy kết quả nào cho "${debouncedSearchTerm}"`
                                            : 'Không có sách nào'}
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 mx-2 border text-black border-secondaryOne bg-primary rounded hover:bg-secondary hover:text-white disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                <span className="px-4 py-2">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 mx-2 border text-black border-secondaryOne bg-primary rounded hover:bg-secondary hover:text-white disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Books;
