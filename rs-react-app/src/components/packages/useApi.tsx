export default function useApi(search: string) {
  let url = 'https://swapi.dev/api/people';
  if (search !== '') {
    url += `/?search=${search}`;
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
