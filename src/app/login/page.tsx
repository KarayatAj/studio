import AuthForm from '@/components/auth-form';
import Logo from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground font-headline">
            Welcome to Reflect Daily
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your personal space for daily reflection and growth.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
