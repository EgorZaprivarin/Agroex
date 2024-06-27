const defineCategory = (parent) => {
  const category = parent === 'Categories' ? 'Vegetables' : parent;

  return category;
};

export default defineCategory;
