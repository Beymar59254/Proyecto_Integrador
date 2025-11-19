# **App Name**: Salesiana Expenses Manager

## Core Features:

- User Authentication: Secure user login with JWT and refresh tokens.
- Role-Based Access Control (RBAC): Manage users and assign roles (admin, manager, accountant, user) with specific permissions.
- Expense Management: CRUD operations for expenses, including creation, editing, and deletion.
- Approval Workflow: Set up workflow statuses and rules for expense approvals.  Allow managers and accounts to create rules for approval.
- Reporting and Analytics: Generate expense reports with filters (date range, department, category) and download them as PDFs.
- PDF Generation: Tool which uses an AI model to compose PDF documents that follow brand guidelines.
- Audit Logging: Record all important actions (create/edit/delete expense, approve, create user) in audit logs.

## Style Guidelines:

- Primary color: Dark blue (#0B3D91), reflecting the Universidad Salesiana de Bolivia's institutional identity.
- Background color: Very light blue (#F6F7FB), providing a clean and modern backdrop.
- Accent color: Teal (#30D5C8), for highlights and interactive elements.
- Font choice: 'Inter' (sans-serif) for body and headline text. Note: currently only Google Fonts are supported.
- Use consistent and clear icons to represent different expense categories and actions.
- Cards with light shadows and rounded borders (12px) to create a modern and clean look.
- Subtle animations with framer-motion for transitions, button hovers, and adding/removing rows.