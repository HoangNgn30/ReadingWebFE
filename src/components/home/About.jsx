import Title from '../home/Title';
import { MdLightbulbOutline } from 'react-icons/md';
import about from '../../assets/about.jpg';
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const cardData = [
    {
        id: 1,
        url: 'https://scontent.fhan18-1.fna.fbcdn.net/v/t1.15752-9/370153770_682810143957076_4466222115197821927_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeFZ-w9hr4SBQYc1f2SCtZbGdvBA617A8SZ28EDrXsDxJikv2E8pgm-TIPpWCRtJ9Dtkk12fY39b3ihl44eZxUE_&_nc_ohc=ASrrsV3PVz0Q7kNvwH5I1OT&_nc_oc=AdkP6Y-t2IdhuIKL3uqq3cD21iEEXwD8pPUtnAkXVV0PAkppKmvMGYw-BvIKe0f7Aw8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&oh=03_Q7cD2QHK5oRgJao-dAZqkk9HuSxvfi9lYy8iP1V7osM77rjm6Q&oe=6849A0CC',
    },
    {
        id: 2,
        url: 'https://scontent.fhan18-1.fna.fbcdn.net/v/t1.15752-9/419450295_797219795606568_4578631226595149084_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeHG7_qAIdwKEeh6DsK1De_X6TezPmv_m4bpN7M-a_-bhpgi6-B3s61lb8u47nZao8oz8NviwWArMIdip0GSuQCw&_nc_ohc=npCeb_6B5NcQ7kNvwHH76Hm&_nc_oc=AdnDmyHdXlVPbFiwEuWQBwTWEsFWkW4hI6HkRVuUP0i07XZbvEPjB5TMHAM6C02jz88&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&oh=03_Q7cD2QE26338UKltqsqcKZMDU8PzzGajHmnzowAb1P-1t69Z8A&oe=68499F3C',
    },
    {
        id: 3,
        url: 'https://scontent.fhan18-1.fna.fbcdn.net/v/t1.15752-9/395514843_855551359583137_5095008204268557082_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeFgKpO-0G_M2ixNPxELNxSFavmzmJCri0lq-bOYkKuLST_uE9e_wPS0vaOBcdjVHId6IDtqvR0EpeTqmx_erHWD&_nc_ohc=iM3HozgX200Q7kNvwGIqFss&_nc_oc=AdkaptXnRqalkHdrOqFxnSsKqHUSsl4JFRhhxpjE84zqa_C8fbMI_Hqighbx2NWfwi8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&oh=03_Q7cD2QGnvyUs04ivfWa02UP2kcZ3Cn4sQA8xj42BVaYZxoQ7kQ&oe=6849B96E',
    },
];

const Card = ({ id, url, setCards, cards }) => {
    const x = useMotionValue(0);
    const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
    const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
    const isFront = id === cards[cards.length - 1].id;
    const rotate = useTransform(() => {
        const offset = isFront ? 0 : id % 2 ? 6 : -6;
        return `${rotateRaw.get() + offset}deg`;
    });

    const handleDragEnd = () => {
        if (Math.abs(x.get()) > 100) {
            setCards((pv) => pv.filter((v) => v.id !== id));
        }
    };

    return (
        <motion.img
            src={url}
            alt="Book cover"
            className="h-96 w-72 origin-bottom rounded-lg bg-white object-cover hover:cursor-grab active:cursor-grabbing"
            style={{
                gridRow: 1,
                gridColumn: 1,
                x,
                opacity,
                rotate,
                transition: '0.125s transform',
                boxShadow: isFront ? '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)' : undefined,
            }}
            animate={{
                scale: isFront ? 1 : 0.98,
            }}
            drag={isFront ? 'x' : false}
            dragConstraints={{
                left: 0,
                right: 0,
            }}
            onDragEnd={handleDragEnd}
        />
    );
};

const About = () => {
    const [cards, setCards] = useState(cardData);

    return (
        <section className="max-padd-container py-12 xl:py-24 bg-bgColorOne">
            {/* container */}
            <div className="flexCenter flex-col gap-16 xl:gap-8 xl:flex-row">
                {/* left side  */}
                <div className="flex-1 ">
                    <Title
                        title1={'Tất cả'}
                        title2={' về Read Love!'}
                        para={
                            'Từ những tác phẩm kinh điển vượt thời gian đến những sáng tác hiện đại, hãy tìm cuốn sách hoàn hảo cho mọi khoảnh khắc '
                        }
                        titleStyles={'pb-10'}
                        paraStyles={'!block text-black'}
                    />
                    <div className="flex flex-col items-start gap-y-4">
                        <div className="flexCenter gap-x-4">
                            <div className="h-16 min-w-16 bg-secondaryOne flexCenter rounded-md">
                                <MdLightbulbOutline className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="medium-18">Thiết kế hiện đại và tối ưu</h4>
                                <p className="text-text1">
                                    Trang web được thiết kế với phong cách hiện đại, tối giản và sang trọng mang lại
                                    trải nghiệm người dùng cao cấp và thân thiện.
                                </p>
                            </div>
                        </div>
                        <div className="flexCenter gap-x-4">
                            <div className="h-16 min-w-16 bg-secondaryOne flexCenter rounded-md">
                                <MdLightbulbOutline className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="medium-18">Thiết kế hiện đại và tối ưu</h4>
                                <p className="text-text1">
                                    Trang web được thiết kế với phong cách hiện đại, tối giản và sang trọng mang lại
                                    trải nghiệm người dùng cao cấp và thân thiện.
                                </p>
                            </div>
                        </div>
                        <div className="flexCenter gap-x-4">
                            <div className="h-16 min-w-16 bg-secondaryOne flexCenter rounded-md">
                                <MdLightbulbOutline className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="medium-18">Thiết kế hiện đại và tối ưu</h4>
                                <p className="text-text1">
                                    Trang web được thiết kế với phong cách hiện đại, tối giản và sang trọng mang lại
                                    trải nghiệm người dùng cao cấp và thân thiện.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* right side  */}
                <div className="flex-1 flexCenter">
                    <div className="bg-secondary flexCenter p-24 max-h-[33rem] max-w-[33rem] rounded-3xl">
                        <div className="grid h-[500px] w-full place-items-center">
                            {cards.map((card) => (
                                <Card key={card.id} cards={cards} setCards={setCards} {...card} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
