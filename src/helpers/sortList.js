export const sortList = [
  { 'New ones first': 'creationDate,desc' },
  { 'Low to High': 'price,asc' },
  { 'High to Low': 'price,desc' },
];

const getSorting = (currentSorting) => {
  return sortList.find(sort => Object.keys(sort)[0] === currentSorting)[currentSorting];
};

export default getSorting;