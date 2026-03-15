import { useContext, useEffect, useState } from 'react';
import Item from '../item/Item';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import useAuthApi from '../../services/authServices';
import { toast } from 'react-toastify';

const Followed = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [followedBooks, setFollowedBooks] = useState([]);
    const {getFavorite, deleteFavorite} = useAuthApi();

    useEffect(() => {
        fetchFollowed();
    }, []);

    const fetchFollowed = async () => {
        try {
            const response = await getFavorite();
            //console.log(response);
            if (response.status === 200 && response.data.listStories != null) {
                setFollowedBooks(response.data.listStories);
            }else{
                toast.error(response.data.message, {autoClose: 500});
            }
        } catch (error) {
            console.log(error);
            toast.error('Không thể tải danh sách sách', { autoClose: 1000 });
        } finally {
            setIsLoading(false);
        }
    }

    const getPaginatedBooks = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return followedBooks.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(followedBooks.length / itemsPerPage);

    if (isLoading) {
        return (
            <section className="max-padd-container py-16 bg-bgColor pt-28">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto"></div>
                </div>
            </section>
        );
    }

    return (
        <>
            <Header></Header>
            <section className="max-padd-container py-16 bg-bgColor pt-28">
                <div className="text-center mb-12">
                    <h2 className="h2">Sách đang theo dõi</h2>
                    <p className="text-text1 mt-4">
                        {!followedBooks || followedBooks.length === 0
                            ? 'Bạn chưa theo dõi cuốn sách nào'
                            : `Bạn đang theo dõi ${followedBooks.length} cuốn sách`}
                    </p>
                </div>

                {followedBooks && followedBooks.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {getPaginatedBooks().map((book) => (
                                <Item key={book.id} book={book} />
                            ))}
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
                ) : (
                    <div className="text-center py-8">
                        <p className="text-text1 text-lg">Bạn chưa theo dõi cuốn sách nào</p>
                    </div>
                )}
            </section>
            <Footer />
        </>
    );
};

export default Followed;
