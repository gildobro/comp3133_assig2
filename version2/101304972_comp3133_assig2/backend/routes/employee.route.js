const express = require('express');
const app = express();
const employeeRoute = express.Router();
// Employee model
let Employee = require('../models/Employee');
// Add Employee
employeeRoute.route('/create').post(async (req, res, next) => {
  Employee.create(req.body)
  .then(data => {
    res.json(data);
  })
  .catch(error => {
    return next(error);
  });
});
// Get All Employees
employeeRoute.route('/').get(async (req, res, next) => {
    try {
        const data = await Employee.find();
        res.json(data);
    } catch (error){
        return next(error)
    }
})
// Get single employee
employeeRoute.route('/read/:id').get(async (req, res, next) => {
  Employee.findById(req.params.id)
  .then(data => {
    res.json(data);
  })
  .catch(error => {
    return next(error);
  });
});

// Update employee
employeeRoute.route('/update/:id').put(async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;
  const options = { new: true };

  Employee.findByIdAndUpdate(id, update, options)
  .then(updatedEmployee => {
     console.log('Employee updated successfully!', updatedEmployee);
      res.json(updatedEmployee);
  })
  .catch(error => {
    console.log('Error updating employee: ', error);
    next(error);
  });
});

// Delete employee
employeeRoute.route('/delete/:id').delete(async (req, res, next) => {
  const { id } = req.params;

  Employee.findOneAndRemove({ _id: id })
  .then((removedEmployee) => {
    if (!removedEmployee) {
      return res.status(404).json({
        error: 'Employee not found'
      });
    }
    return res.status(200).json({
      msg: 'Employee deleted successfully'
    });
  })
  .catch((error) => {
    return next(error);
  });
});
// employeeRoute.route('/delete/:id').delete((req, res, next) => {
//   Employee.findOneAndRemove(req.params.id, (error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       res.status(200).json({
//         msg: data
//       })
//     }
//   });
// });
module.exports = employeeRoute;