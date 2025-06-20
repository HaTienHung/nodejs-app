// helpers/applyQuery.js

export const applyQuery = async (baseQuery, queryParams, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    defaultSort = "-createdAt",
    defaultLimit = 10,
  } = options;

  let query = baseQuery;

  // Search
  if (queryParams.search && searchFields.length > 0) {
    const regex = new RegExp(queryParams.search, "i");
    const orConditions = searchFields.map((field) => ({ [field]: regex }));
    query = query.find({ $or: orConditions });
  }

  // Filter
  const filterConditions = {};
  console.log("filterConditions", filterConditions);
  for (const item of filterFields) {
    if (typeof item === "string") {
      // Lọc theo giá trị đơn
      if (queryParams[item] !== undefined) {
        filterConditions[item] = queryParams[item];
      }
    } else if (typeof item === "object" && item.between) {
      const [minKey, maxKey] = item.between;
      const minVal = queryParams[minKey];
      const maxVal = queryParams[maxKey];
      console.log(typeof maxVal);

      if (minVal !== undefined || maxVal !== undefined) {
        filterConditions[item.field] = {};
        if (minVal !== undefined)
          filterConditions[item.field].$gte = Number(minVal);
        if (maxVal !== undefined)
          filterConditions[item.field].$lte = Number(maxVal);
        console.log(filterConditions[item.field]);
      }
    }
  }

  if (Object.keys(filterConditions).length > 0) {
    query = query.find(filterConditions);
  }

  // Sort
  if (queryParams.sort) {
    const sortFields = queryParams.sort.split(",").join(" ");
    query = query.sort(sortFields);
  } else {
    query = query.sort(defaultSort);
  }

  // Paginate
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || defaultLimit;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Execute
  return await query;
};
