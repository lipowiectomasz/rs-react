export default function useApi(search: string, page = 0) {
  let url = 'https://swapi.dev/api/people';
  if (search !== '') {
    url += `/?search=${search}`;
  }

  if (page > 1 && search !== '') {
    url += `&page=${page}`;
  }

  if (page > 1 && search === '') {
    url += `?page=${page}`;
  }

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}
