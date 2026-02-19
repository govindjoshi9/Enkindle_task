const express = require('express');
const router = express.Router();
const {
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
} = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getWorkflows).post(protect, createWorkflow);
router.route('/:id').put(protect, updateWorkflow).delete(protect, deleteWorkflow);

module.exports = router;