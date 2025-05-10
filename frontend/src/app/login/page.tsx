'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

export default function LoginPage() {
  const { refreshPermissions } = usePermissions();
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      await refreshPermissions();
      router.push('/main');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Iniciar sesión</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email.@example.com"
              {...register('email', { required: 'Email es requerido' })}
              className="input-field w-full"
            />
            {errors.email?.message && (
              <p className="mt-2 text-sm text-red-600">{String(errors.email.message)}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Contraseña es requerida' })}
              className="input-field w-full"
            />
            {errors.password?.message && (
              <p className="mt-2 text-sm text-red-600">{String(errors.password.message)}</p>
            )}
          </div>
          <div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
