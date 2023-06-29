import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/motion';
import Image from 'next/image';
import { ExploreCardId } from '@/constants';

type Props = {
  id: ExploreCardId;
  imgUrl: string;
  title: string;
  active: ExploreCardId;
  index: number;
  selectCard: (id: ExploreCardId) => void;
};

const ExploreCard = ({ id, imgUrl, title, index, active, selectCard }: Props) => {
  return (
    <motion.div
      variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
      className={`relative ${
        active === id ? 'flex-[10] lg:flex-[3.5]' : 'flex-[2] lg:flex-[0.5]'
      } flex h-[700px] min-w-[170px] cursor-pointer items-center justify-center transition-[flex] duration-[0.7s] ease-out-flex`}
      onClick={() => selectCard(id)}
    >
      <Image src={imgUrl} alt={title} className="absolute h-full w-full rounded-[24px] object-cover" fill />
      {active !== id ? (
        <h3 className="absolute z-0 text-[18px] font-semibold text-white sm:text-[26px] lg:bottom-20 lg:origin-[0,0] lg:rotate-[-90deg]">
          {title}
        </h3>
      ) : (
        <div className="absolute bottom-0 flex w-full flex-col justify-start rounded-b-[24px] bg-[rgba(0,0,0,0.5)] p-8">
          <p className="text-[16px] font-bold uppercase leading-[20.16px] text-white">Visualize Instrument</p>
          <h2 className="mt-[24px] text-[24px] font-semibold text-white sm:text-[32px]">{title}</h2>
        </div>
      )}
    </motion.div>
  );
};

export default ExploreCard;
