const roleStyles: Record<string, string> = {
    admin: 'bg-primary/15 text-primary',
    teacher: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    student: 'bg-muted text-muted-foreground',
};

const roleLabels: Record<string, string> = {
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
};

export function RoleBadge({ role }: { role?: string }) {
    if (!role) return null;

    return (
        <span
            className={`inline-flex w-fit items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                roleStyles[role] ?? roleStyles.student
            }`}
        >
            {roleLabels[role] ?? role}
        </span>
    );
}