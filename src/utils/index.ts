function getApiAddress() {
  if (import.meta.env.DEV) {
    return 'http://localhost:3000'
  }

  return (
    (import.meta.env.VITE_REACT_API_URL as string) ||
    'https://www.macrobourse.com:3000'
  )
}
