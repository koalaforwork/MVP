import { createFileRoute, createRouter } from '@tanstack/react-router';
import Signup from '@/components/auth/signup';

export const Route = createFileRoute('/signup')({
  component: Signup,
});

// const SignupPage = () => {
//   return <SignupForm />;
// };

// export default SignupPage;
