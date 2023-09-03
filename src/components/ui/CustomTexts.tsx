import { motion } from 'framer-motion';
import { textContainer, textVariant2 } from '@/utils/motion';
import React from 'react';

type Props = {
  title: string;
  textStyles?: string;
};
export const TypingText = ({ title, textStyles }: Props) => (
  <motion.p variants={textContainer} className={`text-[14px] font-normal text-secondary-white ${textStyles}`}>
    {Array.from(title).map((letter, index) => (
      <motion.span variants={textVariant2} key={index}>
        {letter === ' ' ? '\u00A0' : letter}
      </motion.span>
    ))}
  </motion.p>
);

type TitleProps = {
  title: string | React.ReactNode;
  textStyles?: string;
};
export const TitleText = ({ title, textStyles }: TitleProps) => (
  <motion.h2
    variants={textVariant2}
    initial="hidden"
    whileInView="show"
    className={`mt-[8px] text-[40px] font-bold text-white md:text-[64px] ${textStyles}`}
  >
    {title}
  </motion.h2>
);
