import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Toaster } from '../components/ui/sonner';
import { Moon, Sun, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

export function RecuperarSenha() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Digite seu email');
      return;
    }

    setLoading(true);

    // Simulação de envio de email - aqui você implementaria a chamada real à API
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      toast.success('Email enviado com sucesso!');
    }, 1500);
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Back to login */}
        <div className="absolute top-4 left-4">
          <Link to="/login">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Forgot Password Card */}
        <Card className="w-full max-w-md p-8 shadow-xl">
          {!emailSent ? (
            <>
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-white font-bold text-3xl">B</span>
                </div>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mb-2">
                  Recuperar senha
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  Digite seu email para receber instruções de recuperação
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar instruções'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                  Email enviado!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Enviamos as instruções de recuperação de senha para <strong>{email}</strong>.
                  Verifique sua caixa de entrada e spam.
                </p>
                <Link to="/login" className="w-full">
                  <Button
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  >
                    Voltar para o login
                  </Button>
                </Link>
              </div>
            </>
          )}

          {!emailSent && (
            <>
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                    Lembrou da senha?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Voltar para o login
                </Link>
              </div>
            </>
          )}
        </Card>

        {/* Footer */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
          © 2026 Barber's. Todos os direitos reservados.
        </p>
      </div>
    </>
  );
}
