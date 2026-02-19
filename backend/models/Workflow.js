const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    data: {
        type: String, 
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Workflow', workflowSchema);