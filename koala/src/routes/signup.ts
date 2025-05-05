import { createFileRoute } from '@tanstack/react-router';
import signup from '../pages/signup';

export const Route = createFileRoute('/signup')({
    component: signup
})
