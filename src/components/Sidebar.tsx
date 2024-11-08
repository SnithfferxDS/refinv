import { useAuthStore } from '../store/authStore';
import { APP_NAME, APP_VERSION } from '../configs/constants';

const menuItems = [
    { icon: "grid_view", label: "Overview", url: "/dashboard" },
    { icon: "swap_horiz", label: "Transactions", url: "/dashboard" },
    { icon: "assessment", label: "Reports", url: "/dashboard" },
    { icon: "settings", label: "Settings", url: "/dashboard" },
    { icon: "", label: "Productos", url: "/products/list" },
];
export default function Sidebar() {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    return (
        <div
            className="
            fixed 
	        top-0 
	        left-0 
	        z-20 
	        flex-col 
	        flex-shrink-0 
	        hidden 
	        w-64 
	        h-full 
	        pt-16 
	        font-normal 
            duration-75 
	        md:flex lg:flex 
	        transition-width
            bg-secondary-300
            text-white">
            <div className="flex items-center justify-between p-3">
                <a href="/" className="flex ml-2 md:mr-24">
                    <img src="/img/logo.png" alt="SIPI logo" className="w-16 h-16 mr-2" />
                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                        SIPI v2.0
                    </span>
                </a>
            </div>
            <nav className="flex-1">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.url}
                        className="
                        flex 
                        items-center 
                        gap-3 p-3 
                        rounded 
                        hover:bg-primary-800 
                        transition-colors 
                        dark:hover:bg-primary-500"
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {item.label}
                    </a>
                ))}
            </nav>
            <div className="border-t border-primary-800 
                        dark:hover:bg-primary-500 pt-4">
                <div className="mb-4 px-3">
                    <p className="text-sm opacity-80">Sessión iniciada como:</p>
                    <p className="font-medium">{user?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 p-3 w-full rounded hover:bg-primary-800 transition-colors text-left"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}