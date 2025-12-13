/**
 * Simple toast hook
 * TODO: Replace with a proper toast library like sonner or react-hot-toast
 */

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    const message = title && description ? `${title}: ${description}` : title || description;

    if (variant === 'destructive') {
      alert(`❌ ${message}`);
    } else {
      alert(`✅ ${message}`);
    }
  };

  return { toast };
}
