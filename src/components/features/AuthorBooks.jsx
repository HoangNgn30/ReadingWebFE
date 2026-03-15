import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from '../home/Title';
import Item from '../item/Item';
import Footer from '../footer/Footer';
import storyApi from '../../services/storyServices';

const AuthorBooks = () => {
    const { authorName } = useParams();
    const location = useLocation();
    const { getStory } = storyApi();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const originalAuthorName = location.state?.originalAuthorName || authorName;

    useEffect(() => {
        const fetchAuthorBooks = async () => {
            try {
                setIsLoading(true);
                const response = await getStory(currentPage);
                if (response.status === 200) {
                    const authorBooks = response.data.filter(book => 
                        book.authorName && book.authorName.toLowerCase() === originalAuthorName.toLowerCase()
                    );
                    console.log(authorBooks);
                    setBooks(authorBooks);
                    const totalPages = Math.ceil(authorBooks.length / 20) ;
                    setTotalPages(totalPages);
                } else {
                    toast.error('Lỗi tải sách', { autoClose: 500 });
                }
            } catch (error) {
                toast.error('Không thể tải danh sách truyện', { autoClose: 500 });
                console.error('Error fetching author books:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthorBooks();
    }, [originalAuthorName, currentPage]);

    return (
        <>
            <section className="max-padd-container bg-bgColor">
                <div className="pt-28">
                    {/* Title */}
                    <div className="flexBetween !items-start gap-7 flex-wrap pb-16 max-sm:flexCenter text-center">
                        <Title
                            title1={'Tác giả: '}
                            title2={originalAuthorName}
                            titleStyles={'pb-0 text-start'}
                            para={`Tổng số truyện: ${books.length}`}
                            paraStyles={'!block text-gray-30'}
                        />
                    </div>

                    {/* Loading state */}
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Books grid */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                {books.length > 0 ? (
                                    books.map((book) => <Item book={book} key={book.id} />)
                                ) : (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-text1 text-lg">
                                            Không tìm thấy truyện nào của tác giả này
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
                        </>
                    )}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default AuthorBooks; 