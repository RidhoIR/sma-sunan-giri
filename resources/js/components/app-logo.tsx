
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square  items-center justify-center rounded-md">
                {/* atur ukuran PNG di sini */}
                <AppLogoIcon className="w-10 h-10" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-lg">
                <span className="mb-0.5 truncate leading-tight font-bold uppercase">
                    Pembayaran 
                </span>
                <span className="truncate leading-tight font-bold uppercase">Online</span>
            </div>
        </>
    );
}
