import type { ReactNode } from "react";

interface PrintLayoutProps {
  children: ReactNode;
  title: string;
}

export function PrintLayout({ children, title }: PrintLayoutProps) {
  return (
    <div className="min-h-screen bg-white p-8 text-black print:p-0">
      <div className="mx-auto max-w-[210mm] border p-[10mm] shadow-sm print:border-0 print:shadow-none">
        <header className="mb-8 border-b-2 border-primary pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight text-primary">{title}</h1>
              <p className="text-sm font-medium text-muted-foreground">Healthcare EMR System — Official Medical Record</p>
            </div>
            <div className="text-right text-xs">
              <p>Generated: {new Date().toLocaleString()}</p>
              <p>Ref: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {children}
        </main>

        <footer className="mt-12 border-t pt-4 text-[10px] text-muted-foreground flex justify-between italic">
          <p>© 2026 Healthcare EMR System. Confidential Clinical Data.</p>
          <p>Page 1 of 1</p>
        </footer>
      </div>

      <div className="fixed bottom-4 right-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg hover:opacity-90 transition-opacity"
        >
          Click to Print Record
        </button>
      </div>
    </div>
  );
}
