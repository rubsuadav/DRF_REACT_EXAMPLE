import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateProject() {
  // 1) definimos el estado inicial de la tarea
  const [project, setProject] = useState({
    title: "",
    description: "",
    done: false,
    tasks: [], // atribde rel MtM
  });

  // 2) creamos el estado de la relacion muchos a muchos
  const [tasks, setTasks] = useState([]);

  ///para redireccionar al usuario cuando creemos una tarea exitosa//
  let navigate = useNavigate();

  // 3) creamos las instancias de los atributos de la entidad
  const { title, description } = project;

  // 9) agregamos estado inicial de las validaciones
  const [errors, setErrors] = useState({});

  // ASOCIAR TAREAS AL PROYECTO (ATRIB MTM) /////

  // 4) creamos la funcion de obtener las tareas para la relacion muchos a muchos
  async function getTasks() {
    const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
      method: "GET",
    });
    const data = await response.json();
    setTasks(data);
  }

  // 5) cargamos las tareas al montar el componente
  useEffect(() => {
    getTasks();
  }, []);

  // 6) actualizar el estado de la entidad (tarea)
  function handleChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setProject({
      ...project,
      [e.target.name]: value,
    });

    // limpiamos los errores
    setErrors({});
  }

  // 7) llamar al metodo de la API del post
  async function createProject(e) {
    e.preventDefault();

    // setear propiedad done de los proyectos en funcion de la propiedad done de las tareas
    const allTasksDone = project.tasks.every((task) => {
      const taskObj = tasks.find((t) => t.id === parseInt(task));
      return taskObj.done;
    });

    // Crear una copia del estado del proyecto y actualizar la copia
    const updatedProject = {
      ...project,
      done: allTasksDone,
    };

    const response = await fetch("http://127.0.0.1:8000/api/projects/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProject),
    });

    // validamos los errores del backend
    if (response.status === 400) {
      const data = await response.json();
      setErrors(data);
      return;
    }
    navigate("/projects");
  }

  // 8) creamos la funcion que se encargara de actualizar el estado de la relacion muchos a muchos
  function handleTaskChange(e) {
    setProject({
      ...project,
      tasks: [...e.target.selectedOptions].map((o) => o.value),
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Crear nuevo proyecto
        </h2>
        <form onSubmit={(e) => createProject(e)}>
          {/* llamada a la funcion que se encargara de hacer el post a la api*/}
          <div className="mb-4">
            <label
              htmlFor="Titulo"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Titulo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe un titulo"
              name="title" // nombre del atributo de la entidad del backend
              value={title} // valor del atributo de la entidad del backend
              onChange={(e) => handleChange(e)} // llamada a la funcion que se encargara de actualizar el estado de la entidad
            />
            {/* validacion del campo del formulario */}
            {errors.title && (
              <p className="text-red-500 text-xs italic">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Descripcion"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Descripcion
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Escribe una descripcion"
              name="description"
              value={description}
              onChange={(e) => handleChange(e)}
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description}
              </p>
            )}
          </div>
          {/* relacion muchos a muchos */}
          {tasks.length > 0 ? (
            <div className="mb-4">
              <label
                htmlFor="Tareas"
                className="block mb-2 text-sm font-bold text-gray-700"
              >
                Tareas
              </label>
              <select
                multiple
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="tasks"
                onChange={handleTaskChange}
              >
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
              {errors.tasks && (
                <p className="text-red-500 text-xs italic">{errors.tasks}</p>
              )}
            </div>
          ) : (
            <div className="mb-8">
              <Link
                className="w-auto px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline mb-8"
                to="/createtask"
              >
                Crear tareas
              </Link>
              <div className="mt-4">
                {errors.tasks && (
                  <p className="text-red-500 text-xs italic">{errors.tasks}</p>
                )}
              </div>
            </div>
          )}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-auto px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Crear proyecto
            </button>
            <Link
              className="w-auto px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
              to="/projects"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
