import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@yedirenklicinar/ui-kit';
import { ShieldAlert, Home } from 'lucide-react';

export const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert size={40} className="text-red-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-800">Yetkisiz Erişim</h1>
                    <p className="text-slate-600">
                        Bu sayfaya erişim yetkiniz bulunmamaktadır.
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                    >
                        Geri Dön
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <Home size={18} />
                        Ana Sayfa
                    </Button>
                </div>
            </Card>
        </div>
    );
};
