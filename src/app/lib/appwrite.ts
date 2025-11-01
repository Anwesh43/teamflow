import {
    Client,
    TablesDB,
    Account,
    ID,
    Query,
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

export interface Task extends Models {
    title: string;
    description: string;
    priority: string;
    timeEstimate: number;
    status?: string;
    assignedTo?: string;
    userId: string;
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
        async register(email: string, password: string, name: string) {
            const userId = ID.unique()
            const user = await account.create({
                userId, email, password, name
            })
            console.log("USER", user)
            return user
        },
        async getCurrentUserId() {
            let userId = ""
            try {
                const user = await account.get()
                console.log("USER_OBJECT", user)
                userId = user.$id
                console.log("USER_ID", user.$id, user["$id"])
            } catch (err) {
                console.error("Err", err)
            }
            return userId
        },

        async getCurrentUser() {
            let currentUser = null
            try {
                currentUser = await account.get()
                console.log("CURRENT_USER", currentUser)
                return currentUser
            } catch (err) {
                console.log("ERR", err)
                throw err
            }
        }
    }
}

export const taskHelper = () => {
    const authHelperObj = authHelper()
    return {
        async getTasks() {
            const userId = await authHelperObj.getCurrentUserId()
            const response = await tablesDB.listRows<Task>({
                databaseId,
                tableId: tasksId,
                queries: [
                    Query.equal("userId", userId)
                ]
            })
            return response.rows
        }
    }
}