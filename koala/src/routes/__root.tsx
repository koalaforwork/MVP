import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
})
