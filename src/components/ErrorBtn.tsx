import '../style/ErrorBtn.css';
import { useState } from 'react';

export default function ErrorBtn() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleClick = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('An intentional error has occurred!');
  }

  return (
    <div className="error-btn-box">
      <button onClick={handleClick}>Error Trigger</button>
    </div>
  );
}
