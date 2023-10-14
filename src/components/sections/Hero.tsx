import { motion } from 'framer-motion';
import { slideIn, staggerContainer, textVariant } from '@/utils/motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import MusicIcon from '@/icons/MusicIcon';
import Link from 'next/link';

const Hero = () => (
  <section className={`xs:py-8 py-12 pl-6 sm:py-16 sm:pl-16`}>
    <motion.div
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`inner-width mx-auto flex flex-col`}
    >
      <div className="relative z-10 flex flex-col items-center justify-center pb-12">
        <motion.h1
          variants={textVariant(1.1)}
          className={
            'text-[44px] font-bold uppercase leading-[64.4px] text-white sm:text-[60px] sm:leading-[74.4px] md:text-[100px] md:leading-[114.4px] lg:text-[144px] lg:leading-[158.4px]'
          }
        >
          VizBeats
        </motion.h1>
        <motion.div variants={textVariant(1.2)} className="flex flex-row items-center justify-center pb-6">
          <span
            className={
              'text-[28px] font-medium uppercase leading-[41px] text-white sm:text-[20px] sm:leading-[48px] md:text-[66px] md:leading-[70px] lg:text-[96px] lg:leading-[105px]'
            }
          >
            Visualizers
          </span>
        </motion.div>
        <motion.div variants={textVariant(1.2)} className="flex items-center justify-center">
          <Link href={'/musics'}>
            <Button className="flex items-center gap-x-3 rounded-[32px] bg-[#25618B] px-6 py-6">
              <MusicIcon className="h-6 w-6 text-white" />
              <span className="text-[16px] font-normal text-white sm:text-lg md:text-sm lg:text-xl">시작하기</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="relative -mt-[12px] min-h-[500px] w-full md:-mt-[20px]"
      >
        <Image
          className={'relative rounded-tl-[140px] object-cover'}
          src={'/images/stage.png'}
          alt={'music-stage'}
          fill
        />
      </motion.div>
    </motion.div>
  </section>
);

export default Hero;
