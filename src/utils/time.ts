const formatDate = (dateInput: string): string => {
  const date = new Date(dateInput);
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '.');
};

export { formatDate };
