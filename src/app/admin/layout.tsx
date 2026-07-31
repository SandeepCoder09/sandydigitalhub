import { SuzuWidget } from '@/components/SuzuWidget';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SuzuWidget /> {/* SUZU floating AI agent button */}
    </>
  );
}
