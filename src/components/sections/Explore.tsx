import { useState } from 'react';
import { motion } from 'framer-motion';
import { exploreWorlds } from '@/constants';
import { staggerContainer } from '@/utils/motion';
import { TitleText, TypingText } from '@/components/CustomTexts';
import ExploreCard from '@/components/ExploreCard';

const Explore = () => {
  const [active, setActive] = useState('instrument-3');

  return (
    <section className={`paddings`} id="explore">
      <motion.div
        variants={staggerContainer(0, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`inner-width mx-auto flex flex-col`}
      >
        <TypingText title="| The Visualizer" textStyles="text-center" />
        <TitleText
          title={
            <>
              Choose the music you want <br className="hidden md:block" /> to visualize
            </>
          }
          textStyles="text-center"
        />
        <div className="mt-[50px] flex min-h-[70vh] flex-col gap-5 lg:flex-row">
          {exploreWorlds.map((world, index) => (
            <ExploreCard key={world.id} {...world} index={index} active={active} handleClick={setActive} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Explore;
