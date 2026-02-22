export const buildQuery = (query) => {
  const page = parseInt(query.page || 1);
  const limit = parseInt(query.limit || 10);
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const sortBy = query.sortBy || "createdAt";
  const order = query.order === "asc" ? 1 : -1;

  return { page, limit, skip, search, sortBy, order };
};