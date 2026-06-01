import { Category } from "./categories";

export interface TransactionDTO {
    id: string;
    amount: number;
    description: string;
    type: string;
    transactionDate: string;
    category?:Category
}

export interface DaySnapshotDTO{
    date: string;
    balance: number;
    transactions: TransactionDTO[]
}

export interface ProjectionSnapshotDTO {
    days: DaySnapshotDTO[]
}
