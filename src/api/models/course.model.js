const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    instructor: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ['débutant', 'intermédiaire', 'avancé'],
        default: 'débutant',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
