import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/role-badge';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-0.5 text-left text-sm leading-tight">
                <div className="flex items-center gap-1.5">
                    <span className="truncate font-medium">{user.name}</span>
                    <RoleBadge role={(user as any).role} />
                </div>
                {showEmail && (
                    <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}