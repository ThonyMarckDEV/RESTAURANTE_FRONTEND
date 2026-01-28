import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, ChevronDownIcon, PowerIcon, XMarkIcon, ListBulletIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout } from 'js/logout';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { BeefIcon, Building, ChartBarIcon, Home, Settings, ShoppingBasket, ShoppingCartIcon, Soup, UserCircle2Icon, UserIcon, PillBottle, Boxes, UserCogIcon } from 'lucide-react';
import { FaCashRegister, FaMoneyBill, FaUserGraduate } from 'react-icons/fa';

const menus = {
    superadmin: [
        { section: 'Home', icon: Home, link: '/superadmin' },
        { section: 'Sedes', icon: Building, subs: [{ name: 'Agregar Sede', link: '/superadmin/agregar-sede' }, { name: 'Listar Sedes', link: '/superadmin/listar-sedes' }] },
        { section: 'Categorías', icon: ListBulletIcon, subs: [{ name: 'Agregar Categoría', link: '/superadmin/agregar-categoria' }, { name: 'Listar Categorías', link: '/superadmin/listar-categorias' }] },
        { section: 'Proveedores', icon: UserIcon, subs: [{ name: 'Agregar Proveedor', link: '/superadmin/agregar-proveedor' }, { name: 'Listar Proveedores', link: '/superadmin/listar-proveedores' }] },
        { section: 'Insumos', icon: BeefIcon, subs: [{ name: 'Agregar Insumo', link: '/superadmin/agregar-insumo' }, { name: 'Listar Insumos', link: '/superadmin/listar-insumos' }] },
        { section: 'Sesiones Caja', icon: FaCashRegister, subs: [{ name: 'Listar Sesiones Caja', link: '/superadmin/listar-sesiones-caja' }] },
        { section: 'Ventas', icon: ShoppingCartIcon, subs: [{ name: 'Listar Ventas', link: '/superadmin/listar-ventas' }] },
        { section: 'Comprobantes', icon: ListBulletIcon, subs: [{ name: 'Listar Comprobantes', link: '/superadmin/listar-comprobantes' }] },
        { section: 'Reposiciones', icon: ChartBarIcon, subs: [{ name: 'Listar Reposiciones', link: '/superadmin/listar-reposiciones' }] },
        { section: 'Kardex', icon: ClipboardDocumentCheckIcon, subs: [{ name: 'Reporte Kardex', link: '/superadmin/reporte-kardex' }] },
        { section: 'Configuración', icon: Settings, link: '/superadmin/configuracion-negocio' },
    ],
    admin: [
        { section: 'Home', icon: Home, link: '/admin' },
        { section: 'Almacenes', icon:Boxes, subs: [{ name: 'Agregar Almacen', link: '/admin/agregar-almacen' }, { name: 'Listar Almacenes', link: '/admin/listar-almacenes' }] },
        { section: 'Cajeros', icon: UserCircle2Icon, subs: [{ name: 'Agregar Cajero', link: '/admin/agregar-cajero' }, { name: 'Listar Cajeros', link: '/admin/listar-cajeros' }] },
        { section: 'Cajas', icon: FaCashRegister, subs: [{ name: 'Agregar Caja', link: '/admin/agregar-caja' }, { name: 'Listar Cajas', link: '/admin/listar-cajas' }] },
        { section: 'Sesiones Caja', icon: FaMoneyBill, subs: [{ name: 'Listar Sesiones Caja', link: '/admin/listar-sesiones-caja' }] },
        { section: 'Meseros', icon: FaUserGraduate, subs: [{ name: 'Agregar Mesero', link: '/admin/agregar-mesero' }, { name: 'Listar Meseros', link: '/admin/listar-meseros' }] },
        { section: 'Productos', icon: PillBottle, subs: [{ name: 'Agregar Producto', link: '/admin/agregar-producto-venta' }, { name: 'Listar Productos', link: '/admin/listar-productos-venta' }] },
        { section: 'Platos', icon: Soup, subs: [{ name: 'Agregar Plato', link: '/admin/agregar-plato' }, { name: 'Listar Platos', link: '/admin/listar-platos' }] },
        { section: 'Compras Insumos', icon: ShoppingBasket, subs: [{ name: 'Hacer Compra', link: '/admin/agregar-compra-insumo' }, { name: 'Listar Compras', link: '/admin/listar-compras-insumos' }] },
        { section: 'Compras Productos', icon: ShoppingBasket, subs: [{ name: 'Hacer Compra', link: '/admin/agregar-compra-producto' }, { name: 'Listar Compras', link: '/admin/listar-compras-productos' }] },
        { section: 'Ventas', icon: ShoppingCartIcon, subs: [{ name: 'Listar Ventas', link: '/admin/listar-ventas' }] },
        { section: 'Comprobantes', icon: ListBulletIcon, subs: [{ name: 'Listar Comprobantes', link: '/admin/listar-comprobantes' }] },
        { section: 'Reposiciones', icon: ChartBarIcon, subs: [{ name: 'Agregar Reposición', link: '/admin/agregar-reposicion' }, { name: 'Listar Reposiciones', link: '/admin/listar-reposiciones' }] },
        { section: 'Kardex', icon: ClipboardDocumentCheckIcon, subs: [{ name: 'Reporte Kardex', link: '/admin/reporte-kardex' }] },
    ],
    cajero: [
        { section: 'Home', icon: Home, link: '/cajero' },
        { section: 'Ventas', icon: ShoppingCartIcon, subs: [{ name: 'Agregar Venta', link: '/cajero/agregar-venta' }, { name: 'Listar Ventas', link: '/cajero/listar-ventas' }] },
        { section: 'Comprobantes', icon: ListBulletIcon, subs: [{ name: 'Listar Comprobantes', link: '/cajero/listar-comprobantes' }] },
    ],
    mesero: [
        { section: 'Home', icon: Home, link: '/mesero' },
        { section: 'Pedidos', icon: ShoppingCartIcon, subs: [{ name: 'Listar Pedidos', link: '/mesero/listar-pedidos' }] },
    ],
};

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null); 
    const [showConfirm, setShowConfirm] = useState(false);
    
    const location = useLocation();
    const refresh_token = jwtUtils.getRefreshTokenFromCookie();
    const rol = refresh_token ? jwtUtils.getUserRole(refresh_token) : null;

    const roleMenu = useMemo(() => {
        return rol && menus[rol] ? menus[rol] : [];
    }, [rol]);

    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };

    const toggleSection = (section) => {
        setOpenSection(prevSection => prevSection === section ? null : section);
    };

    const isSectionActive = useCallback((item) => {
        const currentPath = location.pathname;
        if (item.section === 'Home') return currentPath === item.link;
        if (item.subs) return item.subs.some(sub => currentPath.startsWith(sub.link));
        if (item.link) return currentPath.startsWith(item.link);
        return false;
    }, [location.pathname]);

    useEffect(() => {
        const activeItem = roleMenu.find(item => isSectionActive(item));
        if (activeItem && activeItem.subs) setOpenSection(activeItem.section);
    }, [location.pathname, roleMenu, isSectionActive]);

    return (
        <>
            {/* CSS inyectado para ocultar la barra de scroll pero permitir el desplazamiento */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* BOTÓN MÓVIL */}
            <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-restaurant-primary text-white rounded-md shadow-lg" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <XMarkIcon className="h-6 w-6"/> : <Bars3Icon className="h-6 w-6" />}
            </button>

            {/* OVERLAY MÓVIL */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

            {/* SIDEBAR CONTAINER */}
            <div className={`fixed inset-y-0 left-0 w-64 shadow-2xl z-40 flex flex-col bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                
                {/* 1. CABECERA (Logo y Perfil) */}
                <div className="shrink-0 h-40 bg-restaurant-surface flex flex-col items-center justify-center border-b-4 border-restaurant-secondary relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-restaurant-primary"></div>
                    <div className="bg-white p-2 rounded-full shadow-md border-2 border-restaurant-accent mb-1"><span className="text-3xl">🍽️</span></div>
                    <h1 className="font-serif text-lg font-bold text-restaurant-primary tracking-wide">RESTAURANT</h1>
                    <span className="text-[10px] text-restaurant-secondary font-medium uppercase tracking-widest">{rol?.replace('_', ' ') || 'Invitado'}</span>
                </div>

                {/* 2. CONTENEDOR DEL MENÚ (Cuerpo Rojo) */}
                <div className="flex-1 flex flex-col bg-restaurant-primary min-h-0">
                    
                    {/* ÁREA DE SCROLL NATURAL (Barra invisible) */}
                    <div className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
                        <nav className="space-y-2">
                            {roleMenu.map((item, index) => {
                                const isActive = isSectionActive(item); 
                                const isSubOpen = item.subs && openSection === item.section; 
                                const Icon = item.icon;

                                return (
                                    <div key={index} className="mb-1">
                                        {item.subs ? (
                                            <div className="rounded-lg overflow-hidden">
                                                <button
                                                    className={`w-full flex items-center justify-between py-3 px-4 transition-all duration-200 border-l-4 ${isActive ? 'bg-restaurant-dark border-restaurant-accent text-white shadow-lg' : 'border-transparent text-red-100 hover:bg-red-900 hover:text-white'}`} 
                                                    onClick={() => toggleSection(item.section)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {Icon && <Icon className="h-5 w-5 text-restaurant-accent" />}
                                                        <span className="font-medium text-sm tracking-wide">{item.section}</span>
                                                    </div>
                                                    <ChevronDownIcon className={`h-4 w-4 text-restaurant-accent transform transition-transform duration-300 ${isSubOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                
                                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSubOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <ul className="bg-black/20 pb-2 pt-1 space-y-1">
                                                        {item.subs.map((sub, subIndex) => (
                                                            <li key={subIndex}>
                                                                <Link
                                                                    to={sub.link}
                                                                    className={`block py-2 pl-12 pr-4 text-xs transition-all duration-200 border-l-2 ml-4 ${location.pathname.startsWith(sub.link) ? 'border-restaurant-accent text-restaurant-accent font-semibold bg-white/5' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'}`}
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.link}
                                                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 border-l-4 ${isActive ? 'bg-restaurant-dark border-restaurant-accent text-white font-bold shadow-md' : 'border-transparent text-red-100 hover:bg-red-900 hover:text-white'}`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {Icon && <Icon className="h-5 w-5 text-restaurant-accent" />}
                                                <span className="text-sm tracking-wide">{item.section}</span>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* 3. FOOTER (Botón Salir) */}
                    <div className="shrink-0 p-4 border-t border-red-800 bg-restaurant-primary z-10">
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full group flex items-center justify-center gap-3 bg-restaurant-secondary hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            <PowerIcon className="h-5 w-5 text-restaurant-surface group-hover:animate-pulse" />
                            <span className="font-bold tracking-wider text-xs">SALIR</span>
                        </button>
                        <p className="text-center text-[10px] text-red-300/60 mt-2 font-serif italic">RESTAURANT V1.0</p>
                    </div>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {showConfirm && (
                <ConfirmModal
                    message="¿Desea cerrar su sesión actual?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default Sidebar;