import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { User } from '@/types';
import { Loader2, PencilIcon } from 'lucide-react';

interface Props {
    wali: User;
}

const Edit = ({ wali }: Props) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, } = useForm({
        name: wali.name,
        email: wali.email,
        no_hp: wali.no_hp,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setData({
            name: wali.name,
            email: wali.email,
            no_hp: wali.no_hp,
            password: '',
            password_confirmation: '',
        });
    }, [wali, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.wali.update", wali.id), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <div>
            {/* Dialog and form for editing wali */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"blue"}>
                        <PencilIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Data</DialogTitle>
                        <DialogDescription>
                            Masukkan data yang ingin diubah sesuai dengan form yang ada dibawah ini 
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="no_hp">No HP</Label>
                                <Input
                                    id="no_hp"
                                    value={data.no_hp}
                                    onChange={e => setData('no_hp', e.target.value)}
                                />
                                {errors.no_hp && <p className="text-red-600">{errors.no_hp}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <Label htmlFor="confirm_password">Confirm Password</Label>
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                />
                                {errors.password_confirmation && <p className="text-red-600">{errors.password_confirmation}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Save Change'
                                    )}
                                </Button>
                                <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Edit;
