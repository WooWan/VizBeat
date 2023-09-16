'use client';
import { motion } from 'framer-motion';
import { ExploreCardId, exploreWorlds } from '@/constants';
import { staggerContainer } from '@/utils/motion';
import { TitleText, TypingText } from '@/components/ui/CustomTexts';
import ExploreCard from '@/components/sections/explore/ExploreCard';
import { useState } from 'react';

const Explore = () => {
  const [selected, setSelected] = useState<ExploreCardId>('instrument-2');

  const selectCard = (card: ExploreCardId) => {
    setSelected(card);
  };

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
            <ExploreCard key={world.id} {...world} index={index} active={selected} selectCard={selectCard} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Explore;
