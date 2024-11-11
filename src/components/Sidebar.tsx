import { useAuthStore } from '../store/authStore';
import { APP_NAME, APP_VERSION } from '../configs/constants';

const menuItems = [
    { icon: "grid_view", label: "Dashboard", url: "/dashboard", submenu: [] },
    { icon: "list", label: "Cotizaciones", url: "/quotations", submenu: [] },
    {
        icon: "package_2", label: "Productos", url: "", submenu: [
            { label: "Lista", url: "/products" },
            { label: "Reportes", url: "/products/reports" }
        ]
    },
    {
        icon: "beenhere", label: "Marcas", url: "", submenu: [
            { label: "Lista", url: "/brands" },
            { label: "Lista", url: "/brands/reports" },
        ]
    },
    { icon: "receipt_long", label: "Compras", url: "/purchases", submenu: [] },
    { icon: "receipt_long", label: "Ventas", url: "/sales", submenu: [] },
    { icon: "receipt_long", label: "Facturas", url: "/invoices", submenu: [] },
    { icon: "order_approve", label: "Pedidos", url: "/orders", submenu: [] },
    { icon: "swap_horiz", label: "Movimientos", url: "/movements", submenu: [] },
    { icon: "assessment", label: "Reportes", url: "/reports", submenu: [] },
    { icon: "settings", label: "Settings", url: "/settings", submenu: [] },
];


export default function Sidebar() {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    return (
        <>
            <aside
                id="sidebar"
                className="
                fixed 
                top-0 
                left-0 
                z-20 
                flex 
                flex-col 
                flex-shrink-0 
                hidden 
                h-full 
                pt-16 
                font-normal 
                duration-75 
                lg:flex 
                transition-width
                w-64
                shadow-md
            "
                aria-label="Sidebar">
                <div className="
                    relative
                    flex 
                    flex-col 
                    flex-1 
                    min-h-0 
                    pt-0 
                    border-r 
                    bg-secondary-200 
                    text-white 
                    border-secondary-300 
                    dark:bg-secondary-500 
                    dark:border-secondary-600">
                    <div
                        className="
                        flex 
                        flex-col 
                        flex-1 
                        pt-5 
                        pb-28 
                        overflow-y-auto 
                        scrollbar 
                        scrollbar-w-2 
                        scrollbar-thumb-rounded-[0.1667rem] 
                        scrollbar-thumb-slate-200 
                        scrollbar-track-gray-400 
                        dark:scrollbar-thumb-slate-900 
                        dark:scrollbar-track-gray-800"
                    >
                        <div
                            className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                        >
                            <ul className='space-y-2'>
                                <li>
                                    <form action="/search" method="GET" className="lg:hidden">
                                        <label htmlFor="mobile-search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd"
                                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <input type="text" name="mobile-search" id="mobile-search"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Search.." />
                                        </div>
                                    </form>
                                </li>
                                {menuItems.map((item) => (
                                    item.submenu.length > 0 ?
                                        <li>
                                            <button
                                                key={item.label}
                                                type="button"
                                                className="flex items-center p-2 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-slate-100 hover:text-primary-200 dark:hover:bg-slate-700"
                                                aria-controls="dropdown-pages"
                                                data-collapse-toggle="dropdown-pages">
                                                <span className="material-symbols-outlined">{item.icon}</span>
                                                <span className="flex-1 ml-3 text-left whitespace-nowrap">{item.label}</span>
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-6 h-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                            </button>
                                            <ul id="dropdown-pages" className="hidden py-2 space-y-2">
                                                {
                                                    item.submenu.map((submenuItem) => (
                                                        <li>
                                                            <a
                                                                href={submenuItem.url}
                                                                className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700">
                                                                {submenuItem.label}
                                                            </a>
                                                        </li>
                                                    )
                                                    )
                                                }
                                            </ul>
                                        </li>
                                        :
                                        <li>
                                            <a
                                                key={item.label}
                                                href={item.url}
                                                className="
                                                flex
                                                items-center
                                                p-2
                                                text-base
                                                font-normal
                                                rounded-lg
                                                hover:bg-slate-100
                                                hover:text-primary-200
                                                dark:hover:bg-slate-700
                                                dark:hover:text-white group">
                                                <span className="material-symbols-outlined">{item.icon}</span>
                                                <span className="ml-3">{item.label}</span>
                                            </a>
                                        </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
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
            </aside>
            <div
                className="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90"
                id="sidebarBackdrop"
            >
            </div>
        </>
    );
}