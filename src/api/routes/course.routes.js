const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/level/:level', courseController.getCoursesByLevel);

module.exports = router;
