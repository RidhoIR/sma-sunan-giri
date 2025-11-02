import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import RouteLayout from './route-layout';
export default function AuthLayout({ children, title, ...props }: { children: React.ReactNode; title: string; }) {
    return (
        <RouteLayout>
            <AuthLayoutTemplate title={title} {...props}>
                {children}
            </AuthLayoutTemplate>
        </RouteLayout>
    );
}
