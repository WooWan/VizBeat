import MusicsNavbar from '@/components/layout/MusicsNavbar';
import MusicsCanvas from '@/canvas/MusicsCanvas';

const MusicsPage = () => {
  return (
    <div className={'grid h-screen lg:grid-cols-[480px_minmax(900px,_1fr)]'}>
      <MusicsNavbar />
      <MusicsCanvas />
    </div>
  );
};

export default MusicsPage;
