import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// local layout imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Payments from "./components/Payments";

// local pages imports
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Authentication and routes
import { AuthContextProvider } from "./context/authContext";
import PublicRoute from "./context/routes/PublicRoute";
import PrivateRoute from "./context/routes/PrivateRoute";

export default function App() {
  return (
    <div>
      <AuthContextProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes  =====================================*/}
            <Route path="/" element={<PublicRoute />}>
              <Route index element={<Home />} />
              {/* CRUD DE TAREAS */}
              {/* LISTA DE TAREAS*/}
              <Route path="/tasks" element={<Tasks />} />
              {/* SHOW DE TAREA */}
              <Route path="/task/:id" element={<TaskDetails />} />
              {/* CREAR TAREAS */}
              <Route path="/createtask" element={<CreateTask />} />
              {/* EDITAR TAREA */}
              <Route path="/edittask/:id" element={<EditTask />} />
              {/* CRUD DE PROYECTOS */}
              {/* LISTA DEPROYECTOS */}
              <Route path="/projects" element={<Projects />} />
              {/* SHOW DE PROYECTO */}
              <Route path="/project/:id" element={<ProjectDetails />} />
              {/* CREAR PROYECTOS */}
              <Route path="/createproject" element={<CreateProject />} />
              {/* EDITAR PROYECTO */}
              <Route path="/editproject/:id" element={<EditProject />} />
              {/* Login and register */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Payments */}
              <Route path="/payments" element={<Payments />} />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </AuthContextProvider>
    </div>
  );
}
