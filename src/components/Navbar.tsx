import { motion } from 'framer-motion';
import { navVariants } from '@/utils/motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Navbar = () => (
  <motion.nav variants={navVariants} initial="hidden" whileInView="show" className={`x-paddings  z-50 py-8`}>
    <div className="gradient-01 absolute inset-0 -z-10 w-[50%]" />
    <div className={`inner-width mx-auto flex justify-between gap-8`}>
      <Link href={'/'} className={'cursor-pointer'}>
        <h2 className="text-[24px] font-extrabold leading-[30.24px] text-white">VizBeats</h2>
      </Link>
      <Link href={'/musics'}>
        <Button className={'text-xl text-white'} variant={'link'}>
          Enter VizBeats
        </Button>
      </Link>
    </div>
  </motion.nav>
);

export default Navbar;
