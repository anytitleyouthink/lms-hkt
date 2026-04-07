// app/admin/layout.tsx
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}