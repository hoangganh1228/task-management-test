const Task = require("../../../models/task.model");


const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

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

  // Pagination
  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper (
    {
      currentPage: 1,
      limitItems: 2
    },
    req.query,
    countTasks
  )
  
  // End Pagination

  // Search

  const objectSearch = searchHelper(req.query);

  if(objectSearch.regex) {
    find.title = objectSearch.regex
  }

  // End Search

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

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne({
      _id: id
    }, {
      status: status
    })

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công!"
    });
  }

  
}