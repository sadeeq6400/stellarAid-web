
export interface Milestone {
    id: number;
    title: string;
    status: 'unlocked' | 'locked' | 'pending' | 'released';
    amount: number;
    progress: number;
    goal: number;
  }

export type KycStatus = 'Not Started' | 'In Review' | 'Verified' | 'Rejected';