export interface Task {
    title: string;
    description: string;
    priority: string;
    timeEstimate: number;
    status?: string;
    assignedTo?: string;
}