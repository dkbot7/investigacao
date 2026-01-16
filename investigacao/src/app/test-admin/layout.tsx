import { MockAuthProvider } from '@/contexts/MockAuthContext';

export default function TestAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MockAuthProvider>
      {children}
    </MockAuthProvider>
  );
}
