import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useFetchCharacterDetailsQuery } from '../features/api/starWarsApi';
import { selectCharacterDetail } from '../features/selector/SelectorSlice';
import Loader from './Loader.tsx';
import '../style/Detail.css';

interface DetailProps {
  detailId: string;
}

export default function Detail({ detailId }: DetailProps) {
  const dispatch = useDispatch();
  const detailRef = useRef<HTMLDivElement>(null);
  const {
    data: hero,
    error,
    isLoading,
  } = useFetchCharacterDetailsQuery(detailId);
  const navigate = useNavigate();

  if (hero) {
    dispatch(selectCharacterDetail(hero));
  }

  const handleClose = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="detail">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail" ref={detailRef}>
        <p>Error loading hero details. Please try again later.</p>
        <button onClick={handleClose} className="close-btn">
          Close
        </button>
      </div>
    );
  }

  if (!hero) {
    return null;
  }

  return (
    <div className="detail" ref={detailRef}>
      <button onClick={handleClose} className="close-btn">
        Close
      </button>
      <h3 data-testid="heroname">{hero.name}</h3>
      <p>
        <strong>Height:</strong> {hero.height}
      </p>
      <p>
        <strong>Mass:</strong> {hero.mass}
      </p>
      <p>
        <strong>Hair Color:</strong> {hero.hair_color}
      </p>
      <p>
        <strong>Skin Color:</strong> {hero.skin_color}
      </p>
      <p>
        <strong>Eye Color:</strong> {hero.eye_color}
      </p>
      <p>
        <strong>Birth Year:</strong> {hero.birth_year}
      </p>
      <p>
        <strong>Gender:</strong> {hero.gender}
      </p>
    </div>
  );
}
