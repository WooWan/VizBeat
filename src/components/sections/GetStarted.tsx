import { motion } from 'framer-motion';
import { startingFeatures } from '@/constants';
import { fadeIn, planetVariants, staggerContainer } from '@/utils/motion';
import { TitleText, TypingText } from '@/components/CustomTexts';
import StartSteps from '@/components/StartSteps';
import Image from 'next/image';

const GetStarted = () => (
  <section className={`paddings relative z-10`}>
    <motion.div
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`inner-width mx-auto flex flex-col gap-8 lg:flex-row`}
    >
      <motion.div variants={planetVariants('left')} className={`flex-center flex-1`}>
        <Image
          src={'/images/guitar_home.png'}
          alt={'bass_guitar'}
          width={550}
          height={550}
          className={'rotate-[24deg]'}
        />
      </motion.div>
      <motion.div variants={fadeIn('left', 'tween', 0.2, 1)} className="flex flex-[0.75] flex-col justify-center">
        <TypingText title="| How VizBeats Works" />
        <TitleText title={<>Get started with just a few clicks</>} />
        <div className="mt-[31px] flex max-w-[370px] flex-col gap-[24px]">
          {startingFeatures.map((feature, index) => (
            <StartSteps key={feature} number={`${index < 10 ? '0' : ''} ${index + 1}`} text={feature} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default GetStarted;
