import express from 'express';
import { getAllTables, saveTableRecord, deleteTableRecord } from '../controllers/TableController.js';

const router = express.Router();

router.get('/', getTables);
router.post('/', saveTable);
router.post('/delete', deleteTable);

async function getTables(req, res) {
    const tables = await getAllTables();
    res.json(tables);
}

async function saveTable(req, res) {
    const table = await saveTableRecord(req.body);
    console.log('Table Record after save', table);
    res.json(table);
}

async function deleteTable(req, res) {
    const { id } = req.body;
    const deleteCount = await deleteTableRecord(id);
    // console.log('Delete count:', deleteCount);
    if(deleteCount === 0) {
        return res.status(404).json({message: "Record no found"});
    } else {
        return res.status(200).json({message: "Record deleted successfully"});
    }
}

export default router;