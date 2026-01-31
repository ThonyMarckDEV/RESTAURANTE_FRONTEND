//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


//Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';
import SedeLayout from 'layouts/SedeLayout';

// UIS AUTH
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'ui/auth/Login/Login';

//UI HOME
import Home from 'ui/home/Home';


// UIS SUPERADMIN
  // RUTAS SEDES
  import AgregarSede from 'ui/SuperAdministrador/sedes/agregarSede/AgregarSede';
  import ListarSedes from 'ui/SuperAdministrador/sedes/listarSedes/ListarSedes';
  import EditarSede from 'ui/SuperAdministrador/sedes/editarSede/EditarSede';
  //RUTAS CATEGORIAS
  import AgregarCategoria from 'ui/SuperAdministrador/categorias/agregarCategoria/AgregarCategoria';
  import ListarCategorias from 'ui/SuperAdministrador/categorias/listarCategorias/ListarCategorias';
  import EditarCategoria from 'ui/SuperAdministrador/categorias/editarCategoria/EditarCategoria';
  //RUTAS PROVEEDORES
  import AgregarProveedor from 'ui/SuperAdministrador/proveedores/agregarProveedor/AgregarProveedor';
  import ListarProveedores from 'ui/SuperAdministrador/proveedores/listarProveedor/ListarProveedores';
  import EditarProveedor from 'ui/SuperAdministrador/proveedores/editarProveedor/EditarProveedor';
  //RUTAS INSUMOS
  import AgregarInsumo from 'ui/SuperAdministrador/insumos/agregarInsumo/AgregarInsumo';
  import ListarInsumos from 'ui/SuperAdministrador/insumos/listarInsumos/ListarInsumos';
  import EditarInsumo  from 'ui/SuperAdministrador/insumos/editarInsumo/EditarInsumo';
  //RUTAS PRODUCTOS
  import AgregarProductoVenta from 'ui/SuperAdministrador/productos/agregarProductoVenta/AgregarProductoVenta';
  import ListarProductosVenta from 'ui/SuperAdministrador/productos/listarProductosVenta/ListarProductosVenta';
  import EditarProductoVenta from 'ui/SuperAdministrador/productos/editarProductoVenta/EditarProductoVenta';
  //RUTAS PLATOS
  import AgregarPlato from 'ui/SuperAdministrador/platos/agregarPlato/AgregarPlato';
  import ListarPlatos from 'ui/SuperAdministrador/platos/listarPlatos/ListarPlatos';
  import EditarPlato from 'ui/SuperAdministrador/platos/editarPlato/EditarPlato';
  


// UIS ADMIN
  //RUTAS ALMACEN
  import AgregarAlmacen from 'ui/Administrador/almacenes/agregarAlmacen/AgregarAlmacen';
  import ListarAlmacenes from 'ui/Administrador/almacenes/listarAlmacenes/ListarAlmacenes';
  import EditarAlmacen from 'ui/Administrador/almacenes/editarAlmacen/EditarAlmacen';
  //RUTAS CAJEROS
  import AgregarCajero from 'ui/Administrador/cajeros/agregarCajero/AgregarCajero';
  import ListarCajeros from 'ui/Administrador/cajeros/listarCajeros/ListarCajeros';
  import EditarCajero from 'ui/Administrador/cajeros/editarCajero/EditarCajero';
  //RUTAS CAJAS
  import AgregarCaja from 'ui/Administrador/cajas/agregarCaja/AgregarCaja';
  import ListarCajas from 'ui/Administrador/cajas/listarCajas/ListarCajas';
  import EditarCaja from 'ui/Administrador/cajas/editarCaja/EditarCaja';
  //RUTAS MESEROS
  import AgregarMesero from 'ui/Administrador/meseros/agregarMesero/AgregarMesero';
  import ListarMeseros from 'ui/Administrador/meseros/listarMeseros/ListarMeseros';
  import EditarMesero from 'ui/Administrador/meseros/editarMesero/EditarMesero';
  //RUTAS INSUMOS
  import AgregarCompraInsumo from 'ui/Administrador/compraInsumo/agregarCompraInsumo/AgregarCompraInsumo';
  import ListarComprasInsumos from 'ui/Administrador/compraInsumo/listarComprasInsumos/ListarComprasInsumos';
  import EditarCompraInsumo from 'ui/Administrador/compraInsumo/editarCompraInsumo/EditarCompraInsumo';
  import ListarInventarioInsumos from 'ui/Administrador/inventarioInsumo/listarInventarioInsumos/ListarInventarioInsumos'
  //RUTAS PLATO SEDE
  import GestionarPlatosSede from 'ui/Administrador/platoSede/gestionarPlatoSede/GestionarPlatosSede';




// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';



function AppContent() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={<ProtectedRouteHome element={<Login />} />}
      />

      {/* RUTAS SUPERADMIN */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute
              element={
               <SedeLayout>
                <SidebarLayout />
               </SedeLayout>
              }
             allowedRoles={['superadmin']}
            />
        }
      >
        {/* Ruta Home (cuando solo pones /superadmin) */}
        <Route index element={<Home />} />

        {/* RUTAS SEDES */}
          {/* Ruta Agregar Sede */}
          <Route path="agregar-sede" element={<AgregarSede />} />
          {/* Ruta Listar Sede */}
          <Route path="listar-sedes" element={<ListarSedes />} />
          {/* Ruta Editar Sede */}
          <Route path="editar-sede/:id" element={<EditarSede />} />

        {/* RUTAS CATEGORIAS */}
          {/* Ruta Agregar Categoria */}
          <Route path="agregar-categoria" element={<AgregarCategoria />} />
          {/* Ruta Listar Categoria */}
          <Route path="listar-categorias" element={<ListarCategorias />} />
          {/* Ruta Editar Categoria */}
          <Route path="editar-categoria/:id" element={<EditarCategoria />} />

        {/* RUTAS PROVEEDORES */}
          {/* Ruta Agregar Proveedor */}
          <Route path="agregar-proveedor" element={<AgregarProveedor />} />
          {/* Ruta Listar Proveedor */}
          <Route path="listar-proveedores" element={<ListarProveedores />} />
          {/* Ruta Editar Proveedor */}
          <Route path="editar-proveedor/:id" element={<EditarProveedor />} />

        {/* RUTAS INSUMOS */}
          {/* Ruta Agregar Insumo */}
          <Route path="agregar-insumo" element={<AgregarInsumo />} />
          {/* Ruta Listar Insumos */}
          <Route path="listar-insumos" element={<ListarInsumos />} />
          {/* Ruta Editar Insumo */}
          <Route path="editar-insumo/:id" element={<EditarInsumo />} />

        {/* RUTAS PRODUCTOS */}
          {/* Ruta Agregar Producto */}
          <Route path="agregar-producto-venta" element={<AgregarProductoVenta />} />
          {/* Ruta Listar Productos */}
          <Route path="listar-productos-venta" element={<ListarProductosVenta />} />
          {/* Ruta Editar Producto */}
          <Route path="editar-producto-venta/:id" element={<EditarProductoVenta />} />

        {/* RUTAS PLATOS */}
          {/* Ruta Agregar Plato */}
          <Route path="agregar-plato" element={<AgregarPlato />} />
          {/* Ruta Listar Platos */}
          <Route path="listar-platos" element={<ListarPlatos />} />
          {/* Ruta Editar Plato */}
          <Route path="editar-plato/:id" element={<EditarPlato />} />




      </Route>


      {/* RUTAS ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute 
            element={
              <SedeLayout>
                <SidebarLayout />
              </SedeLayout>
            } 
            allowedRoles={['admin']}
          />
        }
      >
        {/* Ruta Home (cuando solo pones /admin) */}
        <Route index element={<Home />} />

        {/* RUTAS ALMACEN */}
          {/* Ruta Agregar Almacen */}
          <Route path="agregar-almacen" element={<AgregarAlmacen />} />
          {/* Ruta Listar Almacen */}
          <Route path="listar-almacenes" element={<ListarAlmacenes />} />
          {/* Ruta Editar Almacen */}
          <Route path="editar-almacen/:id" element={<EditarAlmacen />} />


        {/* RUTAS CAJEROS */}
          {/* Ruta Agregar Cajero */}
          <Route path="agregar-cajero" element={<AgregarCajero />} />
          {/* Ruta Listar Cajeros */}
          <Route path="listar-cajeros" element={<ListarCajeros />} />
          {/* Ruta Editar Cajero */}
          <Route path="editar-cajero/:id" element={<EditarCajero />} />

        {/* RUTAS CAJAS */}
          {/* Ruta Agregar Caja */}
          <Route path="agregar-caja" element={<AgregarCaja />} />
          {/* Ruta Listar Cajas */}
          <Route path="listar-cajas" element={<ListarCajas />} />
          {/* Ruta Editar Caja */}
          <Route path="editar-caja/:id" element={<EditarCaja />} />\

        {/* RUTAS MESEROS */}
          {/* Ruta Agregar Mesero */}
          <Route path="agregar-mesero" element={<AgregarMesero />} />
          {/* Ruta Listar Meseros */}
          <Route path="listar-meseros" element={<ListarMeseros />} />
          {/* Ruta Editar Mesero */}
          <Route path="editar-mesero/:id" element={<EditarMesero />} />

        {/* RUTAS INSUMOS */}
          {/* Ruta Listar Insumos */}
          <Route path="listar-insumos" element={<ListarInsumos />} />

        {/* RUTAS COMPRA INSUMOS */}
          {/* Ruta Agregar Insumo */}
          <Route path="agregar-compra-insumo" element={<AgregarCompraInsumo />} />
          {/* Ruta Listar Insumos */}
          <Route path="listar-compras-insumos" element={<ListarComprasInsumos />} />
          {/* Ruta Editar Insumo */}
          <Route path="editar-compra-insumo/:id" element={<EditarCompraInsumo />} />
          {/* Ruta Listar Inventario Insumo */}
          <Route path="listar-inventario-insumos" element={<ListarInventarioInsumos />} />
        {/* RUTAS PRODUCTOS */}
          {/* Ruta Listar Productos */}
          <Route path="listar-productos-venta" element={<ListarProductosVenta />} />
        {/* RUTAS PLATO SEDE */}
          {/* Ruta Gestionar Plato Sede */}
          <Route path="gestionar-plato-sede" element={<GestionarPlatosSede />} />



      </Route>



      {/* RUTAS CAJERO */}
      <Route
        path="/cajero"
        element={
          <ProtectedRoute 
            element={
              <SedeLayout>
                <SidebarLayout />
              </SedeLayout>
            } 
           allowedRoles={['cajero']}
          />
        }
      >
        {/* Ruta Home (cuando solo pones /cajero) */}
        <Route index element={<Home />} />

        {/* Aquí agregas más módulos */}

      </Route>


      {/* RUTAS MESERO */}
      <Route
        path="/mesero"
        element={
          <ProtectedRoute 
            element={
              <SedeLayout>
                <SidebarLayout />
              </SedeLayout>
            } 
           allowedRoles={['mesero']}
          />
        }
      >
        {/* Ruta Home (cuando solo pones /mesero) */}
        <Route index element={<Home />} />

        {/* Aquí agregas más módulos */}

      </Route>


      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage404 />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;