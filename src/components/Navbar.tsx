import { motion } from 'framer-motion';
import { navVariants } from '@/utils/motion';
import Link from 'next/link';

const Navbar = () => (
  <motion.nav variants={navVariants} initial="hidden" whileInView="show" className={`x-paddings py-8 relative`}>
    <div className="absolute w-[50%] inset-0 gradient-01" />
    <div className={`inner-width mx-auto flex justify-between gap-8`}>
      <Link href={'/'}>
        <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white">VizBeats</h2>
      </Link>
    </div>
  </motion.nav>
);

export default Navbar;
