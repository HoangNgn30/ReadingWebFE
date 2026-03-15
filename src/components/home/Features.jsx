import filter from '../../assets/features/filter.png';
import rating from '../../assets/features/rating.png';
import follow from '../../assets/features/wishlist.png';

const Features = () => {
    return (
        <section className="max-padding-container py-16">
            <div className='max-padd-container grid grid-cols-1 md:grid-cols-3 gap-5 gap-y-12'>
                <div className='flexCenter flex-col gap-3'>
                    <img src={filter} alt="filterIcon" height={44} width={44} />
                    <div className='flexCenter flex-col'>
                        <h5 className='h5'>Tìm kiếm và bộ lọc nâng cao</h5>
                        <hr className='w-8 bg-secondary h-1 rounded-full border-none'/>
                    </div>
                    <p className="text-center text-text1">
                        Dễ dang tìm kiếm cuốn sách yêu thích của bạn theo tiêu đề, tác giả, thể loại,...
                    </p>
                </div>
                <div className='flexCenter flex-col gap-3'>
                    <img src={rating} alt="ratingIcon" height={44} width={44} />
                    <div className='flexCenter flex-col'>
                        <h5 className='h5'>Đánh giá và xếp hạng của người dùng</h5>
                        <hr className='w-8 bg-secondary h-1 rounded-full border-none'/>
                    </div>
                    <p className="text-center text-text1">
                        Bạn đọc có thể đánh giá và xếp hạng các cuốn sách
                    </p>
                </div>
                <div className='flexCenter flex-col gap-3'>
                    <img src={follow} alt="followIcon" height={44} width={44} />
                    <div className='flexCenter flex-col'>
                        <h5 className='h5'>Theo dõi và yêu thích</h5>
                        <hr className='w-8 bg-secondary h-1 rounded-full border-none'/>
                    </div>
                    <p className="text-center text-text1">
                        Lưu lại cuốn sách mà bạn yêu thích hoặc đang theo dõi
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Features;
