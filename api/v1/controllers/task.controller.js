const Task = require("../../../models/task.model");


const paginationHelper = require("../../../helpers/pagination");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }

  
  // Filter
  if(req.query.status) {
    find.status = req.query.status
  }
  // End Filter

  sort = {};

  // Sort
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }
  // End Sort

  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper (
    {
      currentPage: 1,
      limitItems: 2
    },
    req.query,
    countTasks
  )

  const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
  
  res.json(tasks);
}

module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  })

  res.json(task);
}