import { act } from 'react';

describe('Index Rendering', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders without crashing', () => {
    act(() => {
      jest.isolateModules(async () => {
        await import('../main');
      });
    });
    expect(container.innerHTML).toEqual('');
  });
});
