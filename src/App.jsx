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

// UIS ADMIN
  //RUTAS ALMACEN
  import AgregarAlmacen from 'ui/Administrador/almacenes/agregarAlmacen/AgregarAlmacen';
  import ListarAlmacenes from 'ui/Administrador/almacenes/listarAlmacenes/ListarAlmacenes';
  import EditarAlmacen from 'ui/Administrador/almacenes/editarAlmacen/EditarAlmacen';
  //RUTAS PRODUCTOS
  import AgregarProductoVenta from 'ui/Administrador/productos/agregarProductoVenta/AgregarProductoVenta';
  import ListarProductosVenta from 'ui/Administrador/productos/listarProductosVenta/ListarProductosVenta';
  import EditarProductoVenta from 'ui/Administrador/productos/editarProductoVenta/EditarProductoVenta';
  //RUTAS PLATOS
  import AgregarPlato from 'ui/Administrador/platos/agregarPlato/AgregarPlato';
  import ListarPlatos from 'ui/Administrador/platos/listarPlatos/ListarPlatos';
  import EditarPlato from 'ui/Administrador/platos/editarPlato/EditarPlato';
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