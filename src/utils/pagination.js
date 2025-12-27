export const paginate = (page = 1, limit = 10) => {
  page = Math.max(page, 1);
  limit = Math.min(limit, 100);
  return {
    skip: (page - 1) * limit,
    limit,
  };
};
