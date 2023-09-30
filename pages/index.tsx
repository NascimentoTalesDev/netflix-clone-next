import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import Navbar from '@/components/Navbar';
import useMovieList from '@/hooks/useMovieList';
import useFavorites from '@/hooks/useFavorites';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import useSeriesList from '@/hooks/useSeriesList';
import InfoModal from '@/components/infoModal';
import useInfoModalStore from '@/hooks/useInfoModalStore';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default function Home() {
  
  const {data : movies = []} = useMovieList()
  const {data : series = []} = useSeriesList()
  const {data : favorites = []} = useFavorites()
  const { isOpen, closeModal } = useInfoModalStore()
  return (
    <div className=''>
      <InfoModal visible={isOpen} onClose={closeModal}/>
      <Navbar />
      <Billboard />
      <div className='pb-40'>
        <MovieList title={"Trending Now"}  data={movies} />
        <MovieList title={"Favorites"} data={favorites} />
        <MovieList title={"Series"} data={series} />
      </div>
    </div>
  )
}
