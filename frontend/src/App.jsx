import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask"

export default function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* CRUD DE TAREAS */}
          {/* LISTA DE TAREAS*/}
          <Route path="/tasks" element={<Tasks />} />
          {/* SHOW DE TAREA */}
          <Route path="/task/:id" element={<TaskDetails />} />
          {/* CREAR TAREAS */}
          <Route path="/createtask" element={<CreateTask />} />
          {/* EDITAR TAREA */}
          <Route path="/edittask/:id" element={<EditTask />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
