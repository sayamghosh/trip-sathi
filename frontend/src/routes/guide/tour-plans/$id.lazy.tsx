import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/guide/tour-plans/$id')({
    component: () => (
        <div className="w-full">
            <Outlet />
        </div>
    ),
});
