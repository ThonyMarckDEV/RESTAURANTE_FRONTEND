//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


//Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'ui/auth/Login/Login';

//UI HOME
import Home from 'ui/home/Home';


// UIS ADMIN
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


// UIS USUARIO


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
             element={<SidebarLayout />}
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


      </Route>


      {/* RUTAS ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute 
            element={<SidebarLayout />} 
            allowedRoles={['admin']}
          />
        }
      >
        {/* Ruta Home (cuando solo pones /admin) */}
        <Route index element={<Home />} />

        {/* Ruta Listar Roles */}
        {/* <Route path="listar-roles" element={<ListarRoles />} /> */}

      </Route>



      {/* RUTAS CAJERO */}
      <Route
        path="/cajero"
        element={
          <ProtectedRoute 
           element={<SidebarLayout />} 
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
           element={<SidebarLayout />} 
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