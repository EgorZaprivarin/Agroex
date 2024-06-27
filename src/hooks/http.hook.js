const useHttp = () => {
  const request = async ({
    url,
    data: {
      method = 'GET',
      body = null,
      headers = {},
    },
  }) => {
    const response = await fetch(url, { method, body, headers });

    if (!response.ok) {
      const errors = await response.json();

      return errors;
    } else if (response.status !== 204) {
      if (response.headers.get('content-type') === 'application/json') {
        const data = await response.json();

        return data;
      }
    }
  };

  return request;
};

export default useHttp;
