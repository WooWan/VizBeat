import MusicsNavbar from '@/components/layout/MusicsNavbar';
import MusicsCanvas from '@/components/canvas/MusicsCanvas';
import { fetchMusics } from '@/service/musics';
import { QueryClient, dehydrate } from '@tanstack/react-query';

const MusicsPage = () => {
  return (
    <div className={'grid h-screen lg:grid-cols-[480px_minmax(900px,_1fr)]'}>
      <MusicsNavbar />
      <MusicsCanvas />
    </div>
  );
};

export const getStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['posts'], fetchMusics);

  return {
    props: {
      serverMusics: dehydrate(queryClient)
    }
  };
};

export default MusicsPage;
