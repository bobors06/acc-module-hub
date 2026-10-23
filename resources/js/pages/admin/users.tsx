import { Head, router, usePage } from '@inertiajs/react';
import { ShieldCheck, UserCheck, UserRoundX } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    student_id?: string | null;
    year_level?: string | null;
    role: 'student' | 'teacher' | 'admin';
    is_active: boolean;
    deactivated_at?: string | null;
    created_at: string;
};

type Props = {
    users: ManagedUser[];
};

const roleLabels: Record<ManagedUser['role'], string> = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Administrator',
};

const roleStyles: Record<ManagedUser['role'], string> = {
    student: 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
    teacher: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    admin: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeZone: 'Asia/Manila',
    }).format(new Date(value));
}

export default function Users() {
    const { users, auth } = usePage<Props & { auth: { user: { id: number } } }>().props;
    const [roleDrafts, setRoleDrafts] = useState<Record<number, ManagedUser['role']>>({});

    const updateRole = (user: ManagedUser) => {
        const role = roleDrafts[user.id] ?? user.role;

        if (role === user.role) return;
        if (!window.confirm(`Change ${user.name}'s role to ${roleLabels[role]}?`)) return;

        router.patch(`/admin/users/${user.id}/role`, { role }, {
            preserveScroll: true,
            onSuccess: () => setRoleDrafts((current) => {
                const next = { ...current };
                delete next[user.id];
                return next;
            }),
        });
    };

    const changeStatus = (user: ManagedUser) => {
        const isDeactivated = user.is_active === false;
        const action = isDeactivated ? 'activate' : 'deactivate';
        const message = !isDeactivated
            ? `Deactivate ${user.name}'s account? They will no longer be able to log in or use the system.`
            : `Reactivate ${user.name}'s account?`;

        if (!window.confirm(message)) return;
        router.patch(`/admin/users/${user.id}/${action}`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <ShieldCheck className="size-4" />
                            Administrator tools
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight">User Management</h1>
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                            Manage roles and account access without deleting user records or their module activity history.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card px-4 py-3 text-right shadow-sm">
                        <div className="text-2xl font-bold">{users.length}</div>
                        <div className="text-xs text-muted-foreground">registered users</div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-sm">
                            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">User</th>
                                    <th className="px-4 py-3 font-semibold">Role</th>
                                    <th className="px-4 py-3 font-semibold">Account</th>
                                    <th className="px-4 py-3 font-semibold">Registered</th>
                                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => {
                                    const selectedRole = roleDrafts[user.id] ?? user.role;
                                    const isCurrentRole = selectedRole === user.role;

                                    return (
                                        <tr key={user.id} className="align-middle">
                                            <td className="px-4 py-4">
                                                <div className="font-semibold">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                                {user.student_id && (
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        ID: {user.student_id}{user.year_level ? ` · ${user.year_level}` : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={selectedRole}
                                                        onChange={(event) => setRoleDrafts((current) => ({
                                                            ...current,
                                                            [user.id]: event.target.value as ManagedUser['role'],
                                                        }))}
                                                        disabled={user.is_active === false}
                                                        className="h-9 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                                                        aria-label={`Role for ${user.name}`}
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="teacher">Teacher</option>
                                                        <option value="admin">Administrator</option>
                                                    </select>
                                                    {!isCurrentRole && (
                                                        <Button type="button" size="sm" variant="outline" onClick={() => updateRole(user)}>
                                                            Save
                                                        </Button>
                                                    )}
                                                </div>
                                                <Badge className={`mt-2 ${roleStyles[user.role]}`} variant="secondary">
                                                    {roleLabels[user.role]}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge className={user.is_active === false ? 'bg-red-500/10 text-red-700 dark:text-red-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'} variant="secondary">
                                                    {user.is_active === false ? 'Deactivated' : 'Active'}
                                                </Badge>
                                                {user.deactivated_at && (
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {formatDate(user.deactivated_at)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">{formatDate(user.created_at)}</td>
                                            <td className="px-4 py-4 text-right">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={user.is_active === false ? 'outline' : 'destructive'}
                                                    onClick={() => changeStatus(user)}
                                                    disabled={user.id === auth.user.id}
                                                >
                                                    {user.is_active === false ? <UserCheck className="mr-1.5 size-4" /> : <UserRoundX className="mr-1.5 size-4" />}
                                                    {user.is_active === false ? 'Reactivate' : 'Deactivate'}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && (
                        <div className="p-10 text-center text-sm text-muted-foreground">No registered users found.</div>
                    )}
                </div>
            </div>
        </>
    );
}
