import { CategoryDTO } from './categories';
import { TransactionDTO } from './transactions';

export type TransactionFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurrenceDTO {
  id: string;
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  frequency: TransactionFrequency;
  startDate: string;
  endDate?: string | null;
  occurrences?: number | null;
  category?: CategoryDTO | null;
  transactions?: TransactionDTO[];
}

export interface RecurrenceRequestDTO {
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  frequency: TransactionFrequency;
  startDate: string;
  occurrences?: number | null;
  category?: string | null;
}
