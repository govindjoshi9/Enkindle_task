const Workflow = require('../models/Workflow');
const { encrypt, decrypt } = require('../utils/encryption');


const getWorkflows = async (req, res) => {
    try {
        const workflows = await Workflow.find({ ownerId: req.user.id });

        const decryptedWorkflows = workflows.map(workflow => {
            try {
                return {
                    ...workflow._doc,
                    data: JSON.parse(decrypt(workflow.data))
                };
            } catch (err) {
                console.error(`Failed to decrypt workflow ${workflow.id}:`, err);
                return {
                    ...workflow._doc,
                    data: null,
                    error: 'Decryption failed'
                };
            }
        });

        res.json(decryptedWorkflows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createWorkflow = async (req, res) => {
    try {
        const { name, data } = req.body;

        if (!name || !data) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        let dataString;
        try {
            dataString = JSON.stringify(data);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const encryptedData = encrypt(dataString);

        const workflow = await Workflow.create({
            name,
            data: encryptedData,
            ownerId: req.user.id,
        });

        res.status(201).json({
            _id: workflow.id,
            name: workflow.name,
            data: data, 
            ownerId: workflow.ownerId,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateWorkflow = async (req, res) => {
    try {
        const { name, data } = req.body;
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        if (workflow.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (name) workflow.name = name;
        if (data) {
            let dataString;
            try {
                dataString = JSON.stringify(data);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid data format' });
            }
            workflow.data = encrypt(dataString);
        }

        const updatedWorkflow = await workflow.save();

        res.json({
            ...updatedWorkflow._doc,
            data: data || JSON.parse(decrypt(workflow.data))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        if (workflow.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await workflow.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
};