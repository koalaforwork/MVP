import Home from '../components/Home';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/lib/supabaseClient';

export const Route =   createFileRoute('/')({
  component: Home
})