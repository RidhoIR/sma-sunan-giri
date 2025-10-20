import { Card } from '@/components/ui/card';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex h-[70vh] flex-col items-center justify-center gap-6 bg-gray-100 p-6 md:min-h-svh md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-8">
                    <Card className='p-4'>
                        <div className="flex flex-col items-center gap-4">
                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                        {children}
                    </Card>
                </div>
            </div>
        </div>
    );
}
