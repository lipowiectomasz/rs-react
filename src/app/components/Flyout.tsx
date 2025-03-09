import { useSelector, useDispatch } from 'react-redux';
import {
  unselectAll,
  selectSelectedItems,
} from '../features/selector/SelectorSlice';
import type { Hero } from '../features/selector/SelectorSlice';
import { saveAs } from 'file-saver';

const Flyout = () => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(selectSelectedItems);

  if (selectedItems.length === 0) return null;

  const handleDownload = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Url']
        .concat(
          selectedItems.map(
            (item: Hero, index) => `${index + 1},${item.name},${item.url}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const filename = `${selectedItems.length}_items.csv`;
    saveAs(encodedUri, filename);
  };

  return (
    <div
      style={{
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <p>{selectedItems.length} items are selected</p>
      <div
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <button
          className="pageBtn"
          style={{ width: '200px' }}
          onClick={() => dispatch(unselectAll())}
        >
          Unselect all
        </button>
        <button
          className="pageBtn"
          style={{ width: '200px' }}
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Flyout;
