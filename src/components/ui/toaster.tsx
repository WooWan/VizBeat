import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-center gap-x-4">
              {variant === 'destructive' && <AlertCircleIcon className="h-5 w-5 text-destructive" />}
              {variant === 'success' && <CheckCircle2Icon className="h-5 w-5 text-green-400" />}
              <section className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </section>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
