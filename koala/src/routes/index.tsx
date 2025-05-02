import Home from '../components/Home';
import { createFileRoute } from '@tanstack/react-router';


const ROUTES = {
  HOME: "/",
} as const

export const Route =   createFileRoute('/')({
  component: Home
})
