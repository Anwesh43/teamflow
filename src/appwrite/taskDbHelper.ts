import { TablesDB, ID } from 'node-appwrite'
import client from './client'
import { config } from 'dotenv'
import { Task } from '../models/Task'

config()

export const taskDbHelper = () => {
    const tablesDb = new TablesDB(client)
    const databaseId = process.env.DATABASE_ID || ''
    const tableId = process.env.TABLE_ID || ''
    return {
        async createTask(task: Task) {
            await tablesDb.createRow({
                databaseId,
                tableId,
                rowId: ID.unique(),
                data: task
            })
            console.log("CREATED TASK", task)
        }
    }
}

