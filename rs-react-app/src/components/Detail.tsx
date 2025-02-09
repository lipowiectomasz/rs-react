import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader.tsx';
import '../style/Detail.css';

interface DetailProps {
  detailId: string;
}

interface HeroDetails {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
}

export default function Detail({ detailId }: DetailProps) {
  const [heroDetails, setHeroDetails] = useState<HeroDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHeroDetails(detailId);
  }, [detailId]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (detailRef.current && !detailRef.current.contains(event.target as Node)) {
        handleClose(); // Close the detail view when clicking outside
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const fetchHeroDetails = async (id: string) => {
    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch(`https://swapi.dev/api/people/${id}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch hero details');
      }
      const data = await response.json();
      setHeroDetails(data);
    } catch (err) {
      console.error('Error fetching hero details:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!heroDetails) {
    return null;
  }

  return (
    <div className="detail" ref={detailRef}>
      <button onClick={handleClose} className="close-btn">
        Close
      </button>
      <h3>{heroDetails.name}</h3>
      <p><strong>Height:</strong> {heroDetails.height}</p>
      <p><strong>Mass:</strong> {heroDetails.mass}</p>
      <p><strong>Hair Color:</strong> {heroDetails.hair_color}</p>
      <p><strong>Skin Color:</strong> {heroDetails.skin_color}</p>
      <p><strong>Eye Color:</strong> {heroDetails.eye_color}</p>
      <p><strong>Birth Year:</strong> {heroDetails.birth_year}</p>
      <p><strong>Gender:</strong> {heroDetails.gender}</p>
    </div>
  );
}
