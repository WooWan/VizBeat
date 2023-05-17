import { motion } from 'framer-motion';
import { footerVariants } from '@/utils/motion';
import MusicIcon from '@/icons/MusicIcon';
import Link from 'next/link';

const Footer = () => (
  <motion.footer variants={footerVariants} initial="hidden" whileInView="show" className={`x-paddings relative py-8`}>
    <div className="footer-gradient" />
    <div className={`inner-width mx-auto flex flex-col gap-8`}>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h4 className="text-[44px] font-bold text-white md:text-[64px]">Enter the VizBeats</h4>
        <button type="button" className="flex h-fit items-center gap-[12px] rounded-[32px] bg-[#25618B] px-6 py-4">
          <MusicIcon className="h-6 w-6 text-white" />
          <Link href={'/musics'}>
            <span className="text-[16px] font-normal text-white">Enter VizBeats</span>
          </Link>
        </button>
      </div>
      <div className="flex flex-col">
        <div className="mb-[50px] h-[2px] bg-white opacity-10" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h4 className="text-[24px] font-extrabold text-white">VizBeats</h4>
          <p className="text-[14px] font-normal text-white opacity-50">
            Copyright © 2023 - 2024 VizBeats. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </motion.footer>
);

export default Footer;
