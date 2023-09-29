import { useRouter } from 'next/router';
import {BsFillPlayFill } from 'react-icons/bs';

interface PlayButtonProps{
    movieId: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({movieId}) => {
    const router = useRouter()

    return (
        <button onClick={() => router.push(`/watch/${movieId}`)} 
            className="bg-white rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xl flex flex-row items-center hover:bg-neutral-300 transition text-black">
            <BsFillPlayFill size={25} className={"mr-1"} />
            Play
        </button>
    );
}
 
export default PlayButton;