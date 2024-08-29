module.exports = (objectPagination, query, countRecords) => {
  if(query.page) {
    objectPagination.currentPage = query.page
  }

  if(query.limit) {
    objectPagination.limitItems = query.limit
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * (objectPagination.limitItems);

  const totalPage = Math.ceil(countRecords / objectPagination.limitItems);

  objectPagination.totalPage = totalPage;

  return objectPagination;
}