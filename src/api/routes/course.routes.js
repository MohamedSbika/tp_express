const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { protect } = require('../../middlewares/auth');

// Routes publiques (lecture)
router.get('/', courseController.getAllCourses);
router.get('/level/:level', courseController.getCoursesByLevel);
router.get('/:id', courseController.getCourseById);

// Routes protégées (nécessitent d'être connecté)
router.post('/', protect, courseController.createCourse);
router.patch('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);

module.exports = router;
