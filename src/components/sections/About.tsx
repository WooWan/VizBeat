import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import { TypingText } from '@/components/CustomTexts';

const About = () => (
  <section className={`paddings relative z-10`}>
    <div className="gradient-02 z-0" />
    <motion.div
      variants={staggerContainer(1, 1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`mx-auto max-w-[1280px] flex-center flex-col`}
    >
      <TypingText title="| About VizBeats" textStyles="text-center" />
      <motion.p
        variants={fadeIn('up', 'tween', 0.2, 1)}
        className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-secondary-white"
      >
        <span className="font-extrabold text-white">VizBeats</span> is an innovative leap into the future, where you can
        visualize music and instruments in a way that transcends the ordinary listening experience. This is the true{' '}
        <span className="font-extrabold text-white">wonder of VizBeats</span> today, utilizing a state-of-the-art{' '}
        <span className="font-extrabold text-white">music visualizer</span> that brings each note and instrument to life
        before your eyes. With just <span className="font-extrabold text-white">your device</span>, you can easily
        journey through the vibrant landscapes of your favorite songs, transforming the auditory into the visual. Let's{' '}
        <span className="font-extrabold text-white">explore</span> the wonder of VizBeats by scrolling down.
      </motion.p>
      <motion.img
        variants={fadeIn('up', 'tween', 0.3, 1)}
        src="/arrow-down.svg"
        alt="arrow down"
        className="w-[18px] h-[28px] object-contain mt-[28px] animate-bounce"
      />
    </motion.div>
  </section>
);

export default About;
