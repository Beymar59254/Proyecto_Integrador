'use client';
import { PageHeader } from '@/components/page-header';
import { UsersDataTable } from '@/components/users/data-table';
import { columns } from '@/components/users/columns';
import { users } from '@/lib/data';

export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="Gestión de Usuarios"
        description="Crea, edita y gestiona usuarios y sus roles."
      />
      <UsersDataTable columns={columns} data={users} />
    </>
  );
}
