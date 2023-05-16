import { motion } from 'framer-motion';
import { slideIn, staggerContainer, textVariant } from '@/utils/motion';
import Image from 'next/image';

const Hero = () => (
  <section className={`sm:py-16 xs:py-8 py-12 sm:pl-16 pl-6`}>
    <motion.div
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`inner-width mx-auto flex flex-col`}
    >
      <div className="flex justify-center items-center flex-col relative z-10 pb-12">
        <motion.h1
          variants={textVariant(1.1)}
          className={
            'font-bold lg:text-[144px] md:text-[100px] sm:text-[60px] text-[44px] lg:leading-[158.4px] md:leading-[114.4px] sm:leading-[74.4px] leading-[64.4px] uppercase text-white'
          }
        >
          VizBeats
        </motion.h1>
        <motion.div variants={textVariant(1.2)} className="flex flex-row justify-center items-center">
          <span
            className={
              'font-medium lg:text-[96px] md:text-[66px] sm:text-[20px] text-[28px] lg:leading-[105px] md:leading-[70px] sm:leading-[48px] leading-[41px] uppercase text-white'
            }
          >
            Visualizers
          </span>
        </motion.div>
      </div>
      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="relative w-full min-h-[500px] md:-mt-[20px] -mt-[12px]"
      >
        {/*<div className="absolute w-full h-[350px] hero-gradient rounded-tl-[140px] z-[0] -top-[30px]" />*/}
        <Image
          className={'object-cover rounded-tl-[140px] relative'}
          src={'/images/music_stage2.png'}
          alt={'music-stage'}
          fill
        />
      </motion.div>
    </motion.div>
  </section>
);

export default Hero;
