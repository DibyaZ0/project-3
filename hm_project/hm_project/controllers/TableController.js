import { ObjectId } from "mongodb";
import { getDB } from "../mongo-context.js";

const collectionName = "tables";

export async function getAllTables() {
    try {
        const tables = await getDB().collection(collectionName).find({}).toArray();
        return tables;
    } catch (err) {
        console.error("Error fetching record", err);
    }

}

export async function getTableById(id) {
    try {
        console.log('Id to fetch: ', id);
        const table = await getDB().collection(collectionName).findOne({ _id: id });
        return table;
    } catch (err) {
        console.error("Error fetching record", err);
    }
}

let tableNo = 1; // Module-level variable to keep track of the table number

export async function saveTableRecord(table) {
    try {
        // Ensure tablestatus is initialized as an empty array if not provided
        if (!Array.isArray(table.tablestatus)) {
            table.tablestatus = [];
        }
        // Assign and increment the table number
        table.no = tableNo++;
        console.log('Record to save', table);
        const result = await getDB().collection(collectionName).insertOne(table);
        console.log('Inserted Id: ', result.insertedId);
        if (result.acknowledged) {
            const savedTable = await getTableById(result.insertedId);
            return savedTable;
        } else {
            return "Error saving mongo document";
        }
    } catch (err) {
        console.error("Error saving record", err);
    }
}

export async function deleteTableRecord(id) {
    try {
        console.log('Id to delete: ', id);
        const result = await getDB().collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount;
    } catch (err) {
        console.error("Error deleting record", err);
    }
}