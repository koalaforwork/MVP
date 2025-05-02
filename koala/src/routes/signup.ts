import { createFileRoute } from '@tanstack/react-router';
import signup from '../components/auth/signup';

export const Route = createFileRoute('/signup')({
    component: signup
})
