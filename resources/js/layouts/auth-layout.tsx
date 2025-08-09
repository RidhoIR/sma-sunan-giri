import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import RouteLayout from './route-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <RouteLayout>
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </RouteLayout>
    );
}
