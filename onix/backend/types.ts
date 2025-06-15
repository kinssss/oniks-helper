export type User = {
    login: string;
    password: string;
    role: 'admin' | 'teacher' | 'student';
};
  
export type Ticket = {
    id: number;
    teacherName: string;
    cabinet: string;
    problem: string;
    status: 'active' | 'in_progress' | 'pending' | 'completed';
};
  
export type Request = {
    id: number;
    studentName: string;
    phone: string;
    group: string;
    district: string;
    birthDate: string;
    requestType: string;
};

