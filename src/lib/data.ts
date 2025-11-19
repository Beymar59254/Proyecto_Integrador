import type { Expense, Department, Category, Sede, User, AuditLog, SearchParams } from './types';

export const sedes: Sede[] = [
  { id: 'sede-lp', name: 'La Paz' },
  { id: 'sede-cb', name: 'Cochabamba' },
  { id: 'sede-sc', name: 'Santa Cruz' },
];

export const departments: Department[] = [
  { id: 'd1', name: 'Ingeniería de Sistemas', sede: 'La Paz' },
  { id: 'd2', name: 'Contaduría Pública', sede: 'La Paz' },
  { id: 'd3', name: 'Administración de Empresas', sede: 'Cochabamba' },
  { id: 'd4', name: 'Recursos Humanos', sede: 'Santa Cruz' },
  { id: 'd5', name: 'Psicología', sede: 'Cochabamba' },
  { id: 'd6', name: 'Derecho', sede: 'Santa Cruz' },
  { id: 'd7', name: 'Ciencias de la Educación', sede: 'La Paz' },
];

export const categories: Category[] = [
  { id: 'c1', name: 'Transporte' },
  { id: 'c2', name: 'Material de Oficina' },
  { id: 'c3', name: 'Alimentación' },
  { id: 'c4', name: 'Software y Licencias' },
  { id: 'c5', name: 'Viáticos y Hospedaje' },
  { id: 'c6', name: 'Publicidad y Marketing' },
  { id: 'c7', name: 'Mantenimiento y Reparaciones' },
  { id: 'c8', name: 'Servicios Básicos' },
];

export const users: User[] = [
    { id: 'usr-001', name: 'Juan Pérez', email: 'juan.perez@usalesiana.edu.bo', password: 'user123', role: 'user', department: 'Ingeniería de Sistemas', sede: 'La Paz', status: 'active' },
    { id: 'usr-002', name: 'Maria Garcia', email: 'maria.garcia@usalesiana.edu.bo', password: 'manager123', role: 'manager', department: 'Administración de Empresas', sede: 'Cochabamba', status: 'active' },
    { id: 'usr-003', name: 'Carlos Rodriguez', email: 'carlos.rodriguez@usalesiana.edu.bo', password: 'accountant123', role: 'accountant', department: 'Contaduría Pública', sede: 'La Paz', status: 'active' },
    { id: 'usr-004', name: 'Ana López', email: 'ana.lopez@usalesiana.edu.bo', password: 'user123', role: 'user', department: 'Recursos Humanos', sede: 'Santa Cruz', status: 'active' },
    { id: 'usr-005', name: 'Luis Martinez', email: 'luis.martinez@usalesiana.edu.bo', password: 'user123', role: 'user', department: 'Psicología', sede: 'Cochabamba', status: 'inactive' },
    { id: 'usr-006', name: 'Sofia Hernandez', email: 'sofia.hernandez@usalesiana.edu.bo', password: 'auditor123', role: 'auditor', department: 'Auditoría Interna', sede: 'La Paz', status: 'active' },
    { id: 'usr-007', name: 'Javier Gomez', email: 'javier.gomez@usalesiana.edu.bo', password: 'manager123', role: 'manager', department: 'Ingeniería de Sistemas', sede: 'La Paz', status: 'active' },
    { id: 'usr-008', name: 'Laura Diaz', email: 'laura.diaz@usalesiana.edu.bo', password: 'accountant123', role: 'accountant', department: 'Contaduría Pública', sede: 'La Paz', status: 'inactive' },
    { id: 'usr-009', name: 'Beymar Rodriguez', email: 'beymar.rodriguez.59254@usalesiana.edu.bo', password: 'admin2025', role: 'admin', department: 'Ingeniería de Sistemas', sede: 'La Paz', status: 'active'},
    { id: 'usr-010', name: 'Admin Dos', email: 'admin2@usalesiana.edu.bo', password: 'admin2', role: 'admin', department: 'Administración de Empresas', sede: 'Cochabamba', status: 'active' },
];

const expenseUsers = users.map(u => ({ name: u.name, department: u.department, sede: u.sede }));

const descriptions = [
    'Viaje a conferencia de {sede}',
    'Compra de resmas de papel y tóner',
    'Almuerzo con cliente potencial',
    'Licencia anual de {software}',
    'Viáticos para evento de reclutamiento',
    'Campaña publicitaria en redes sociales',
    'Mantenimiento de servidor de base de datos',
    'Pasajes de bus para visita a campus {sede}',
    'Cena de equipo para celebrar hitos',
    'Renovación de suscripción a {software} Cloud',
    'Material de marketing para feria universitaria',
    'Reparación de aire acondicionado en oficina',
    'Desayuno de trabajo con equipo de {department}',
];

const software = ['Microsoft Office 365', 'Adobe Creative Cloud', 'Slack', 'Zoom', 'Asana'];
const statuses: Expense['status'][] = ['approved', 'pending', 'rejected', 'draft'];

const generateRandomExpense = (id: number, date: Date): Expense => {
    const user = expenseUsers[id % expenseUsers.length];
    const category = categories[id % categories.length];

    let description = descriptions[id % descriptions.length];
    description = description.replace('{sede}', sedes.find(s => s.name !== user.sede)?.name || 'otra sede');
    description = description.replace('{software}', software[id % software.length]);
    description = description.replace('{department}', departments.find(d => d.name !== user.department)?.name || 'otro departamento');

    return {
        id: `EXP-${String(id).padStart(3, '0')}`,
        description,
        amount: parseFloat((Math.random() * (2000 - 50) + 50).toFixed(2)),
        status: statuses[id % statuses.length],
        date: date.toISOString().split('T')[0],
        category: category.name,
        department: user.department,
        sede: user.sede,
        user: user.name,
        receiptUrl: Math.random() > 0.5 ? `/receipts/rec-${id}.pdf` : undefined,
    };
};

const generateExpenses = (): Expense[] => {
    const expenseList: Expense[] = [];
    let currentId = 1;
    const endDate = new Date('2025-10-27');
    let currentDate = new Date('2024-09-01');

    while (currentDate <= endDate) {
        // Add 1 to 5 expenses per day
        const expensesPerDay = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < expensesPerDay; i++) {
            expenseList.push(generateRandomExpense(currentId++, currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return expenseList;
};

export const expenses: Expense[] = generateExpenses();

const logActions: AuditLog['action'][] = ['create', 'update', 'delete', 'login', 'logout', 'approve_report', 'generate_report'];
const logTargets: AuditLog['targetType'][] = ['expense', 'user', 'report', 'system', 'optimisation'];

const generateRandomAuditLog = (id: number, date: Date): AuditLog => {
    const user = users[id % users.length];
    const action = logActions[id % logActions.length];
    const targetType = logTargets[id % logTargets.length];
    const targetId = `${targetType.slice(0,3)}-${String(Math.floor(Math.random() * 100) + 1).padStart(3,'0')}`;
    return {
        id: `log-${String(id).padStart(4, '0')}`,
        user: user.name,
        action,
        targetType,
        targetId,
        timestamp: date.toISOString(),
        details: `Usuario ${user.name} realizó ${action} en ${targetType} ${targetId}`
    };
};

const generateAuditLogs = (): AuditLog[] => {
    const logList: AuditLog[] = [];
    let currentId = 1;
    const endDate = new Date('2025-10-27');
    let currentDate = new Date('2024-09-01');

    while(currentDate <= endDate) {
        const logsPerDay = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < logsPerDay; i++) {
            const logDate = new Date(currentDate);
            logDate.setHours(Math.random()*24, Math.random()*60, Math.random()*60);
            logList.push(generateRandomAuditLog(currentId++, logDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return logList.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const auditLogs: AuditLog[] = generateAuditLogs();


// Server-side pagination and filtering for audit logs
export async function getPaginatedAuditLogs(
  params: SearchParams
): Promise<{ data: AuditLog[]; totalCount: number }> {
  const page = Number(params.page) || 1;
  const perPage = Number(params.per_page) || 10;
  const userQuery = typeof params.user === 'string' ? params.user : undefined;
  const actionQuery = typeof params.action === 'string' ? params.action.split('.') : undefined;
  const targetTypeQuery = typeof params.targetType === 'string' ? params.targetType.split('.') : undefined;
  const from = typeof params.from === 'string' ? params.from : undefined;
  const to = typeof params.to === 'string' ? params.to : undefined;

  let filteredLogs = auditLogs;

  if (userQuery) {
    filteredLogs = filteredLogs.filter(log => log.user.toLowerCase().includes(userQuery.toLowerCase()));
  }
  if (actionQuery && actionQuery.length > 0) {
    filteredLogs = filteredLogs.filter(log => actionQuery.includes(log.action));
  }
  if (targetTypeQuery && targetTypeQuery.length > 0) {
    filteredLogs = filteredLogs.filter(log => targetTypeQuery.includes(log.targetType));
  }
  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
  }

  const totalCount = filteredLogs.length;
  const offset = (page - 1) * perPage;
  const data = filteredLogs.slice(offset, offset + perPage);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return { data, totalCount };
}
