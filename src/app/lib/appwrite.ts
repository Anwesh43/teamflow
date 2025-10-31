import {
    Client,
    TablesDB,
    Account,
    ID,
    type Models,
} from 'appwrite'

const client = new Client()
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client)

export const tablesDB = new TablesDB(client)

export { ID }

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const tasksId = process.env.NEXT_PUBLIC_TABLE_ID!;

export interface Task extends Models.Row {
    title: string;
    description: string;
    priority: string;
    timeEstimate: number;
    status?: string;
    assignedTo?: string;
}

export const taskHelper = () => {
    return {
        async getTasks(): Promise<Task[]> {
            const response = await tablesDB.listRows<Task[]>(
                databaseId,
                tasksId,
            )
            return response.rows as Task[]
        }
    }
}

export const authHelper = () => {
    return {
        async login(email: string, password: string) {
            const result = await account.createEmailPasswordSession({
                email,
                password,
            })
            console.log("RESULT", result)
            return result
        },
        async register(email: string, password: string) {
            const userId = ID.unique()
            const user = await account.create({
                userId, email, password
            })
            console.log("USER", user)
            return user
        }
    }
}

