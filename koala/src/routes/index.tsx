import Home from '../components/Home';
import { createFileRoute } from '@tanstack/react-router';


const ROUTES = {
  HOME: "/",
} as const

type Route = {
  path: string;
  component: React.ComponentType;
}

export const Route =   createFileRoute('/')({
  component: Home
})
