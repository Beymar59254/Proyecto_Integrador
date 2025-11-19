import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sedes = [
  { id: 'sede-lp', name: 'La Paz' },
  { id: 'sede-cb', name: 'Cochabamba' },
  { id: 'sede-sc', name: 'Santa Cruz' },
]

const departments = [
  { id: 'd1', name: 'Ingeniería de Sistemas', sede: 'La Paz' },
  { id: 'd2', name: 'Contaduría Pública', sede: 'La Paz' },
  { id: 'd3', name: 'Administración de Empresas', sede: 'Cochabamba' },
  { id: 'd4', name: 'Recursos Humanos', sede: 'Santa Cruz' },
  { id: 'd5', name: 'Psicología', sede: 'Cochabamba' },
  { id: 'd6', name: 'Derecho', sede: 'Santa Cruz' },
  { id: 'd7', name: 'Ciencias de la Educación', sede: 'La Paz' },
]

const categories = [
  { id: 'c1', name: 'Transporte' },
  { id: 'c2', name: 'Material de Oficina' },
  { id: 'c3', name: 'Alimentación' },
  { id: 'c4', name: 'Software y Licencias' },
  { id: 'c5', name: 'Viáticos y Hospedaje' },
  { id: 'c6', name: 'Publicidad y Marketing' },
  { id: 'c7', name: 'Mantenimiento y Reparaciones' },
  { id: 'c8', name: 'Servicios Básicos' },
]

const users = [
  { id: 'usr-001', name: 'Juan Pérez', email: 'juan.perez@usalesiana.edu.bo', password: 'user123', role: 'user', department: 'Ingeniería de Sistemas', sede: 'La Paz', status: 'active' },
  { id: 'usr-002', name: 'Maria Garcia', email: 'maria.garcia@usalesiana.edu.bo', password: 'manager123', role: 'manager', department: 'Administración de Empresas', sede: 'Cochabamba', status: 'active' },
  { id: 'usr-003', name: 'Carlos Rodriguez', email: 'carlos.rodriguez@usalesiana.edu.bo', password: 'accountant123', role: 'accountant', department: 'Contaduría Pública', sede: 'La Paz', status: 'active' },
  { id: 'usr-004', name: 'Ana López', email: 'ana.lopez@usalesiana.edu.bo', password: 'user123', role: 'user', department: 'Recursos Humanos', sede: 'Santa Cruz', status: 'active' },
  { id: 'usr-005', name: 'Luis Martinez', email: 'luis.martinez@usalesiana.edu.bo', password: 'user123', role: 'user', department: 'Psicología', sede: 'Cochabamba', status: 'inactive' },
  { id: 'usr-006', name: 'Sofia Hernandez', email: 'sofia.hernandez@usalesiana.edu.bo', password: 'auditor123', role: 'auditor', department: 'Auditoría Interna', sede: 'La Paz', status: 'active' },
  { id: 'usr-007', name: 'Javier Gomez', email: 'javier.gomez@usalesiana.edu.bo', password: 'manager123', role: 'manager', department: 'Ingeniería de Sistemas', sede: 'La Paz', status: 'active' },
]

const expenses = [
  { id: 'exp-001', description: 'Compra de material de oficina', amount: 150.0, status: 'approved', date: '2024-09-01T00:00:00.000Z', category: 'Material de Oficina', department: 'Ingeniería de Sistemas', sede: 'La Paz', user: 'usr-001' },
  { id: 'exp-002', description: 'Viaje a Cochabamba', amount: 300.0, status: 'pending', date: '2024-09-05T00:00:00.000Z', category: 'Viáticos y Hospedaje', department: 'Administración de Empresas', sede: 'Cochabamba', user: 'usr-002' },
  { id: 'exp-003', description: 'Software de contabilidad', amount: 500.0, status: 'rejected', date: '2024-09-10T00:00:00.000Z', category: 'Software y Licencias', department: 'Contaduría Pública', sede: 'La Paz', user: 'usr-003' },
]

function generateRandomAuditLog(id: number, date: Date) {
  const usersList = ['usr-001', 'usr-002', 'usr-003', 'usr-004', 'usr-005', 'usr-006', 'usr-007'];
  const actions = ['create', 'update', 'delete', 'login', 'logout', 'generate_report', 'approve_report'];
  const targetTypes = ['user', 'expense', 'report', 'system', 'optimisation'];
  const user = usersList[Math.floor(Math.random() * usersList.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const targetType = targetTypes[Math.floor(Math.random() * targetTypes.length)];
  const targetId = `target-${id}`;
  const details = `Acción ${action} en ${targetType} ${targetId}`;
  return {
    id: `log-${id}`,
    user,
    action,
    targetType,
    targetId,
    timestamp: date.toISOString(),
    details,
  };
}

function generateAuditLogs() {
  const logList = [];
  let currentId = 1;
  const endDate = new Date('2025-10-27');
  let currentDate = new Date('2024-09-01');

  while (currentDate <= endDate) {
    const logsPerDay = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < logsPerDay; i++) {
      const logDate = new Date(currentDate);
      logDate.setHours(Math.random() * 24, Math.random() * 60, Math.random() * 60);
      logList.push(generateRandomAuditLog(currentId++, logDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return logList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const auditLogs = generateAuditLogs();

async function main() {
  console.log('Seeding database...')

  for (const sede of sedes) {
    await prisma.sede.upsert({
      where: { id: sede.id },
      update: {},
      create: sede,
    })
  }

  for (const department of departments) {
    await prisma.department.upsert({
      where: { id: department.id },
      update: {},
      create: department,
    })
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    })
  }

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    })
  }

  for (const expense of expenses) {
    await prisma.expense.upsert({
      where: { id: expense.id },
      update: {},
      create: expense,
    })
  }

  for (const log of auditLogs.slice(0, 100)) {
    await prisma.auditLog.create({
      data: log,
    })
  }

  console.log('Seeding completed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
