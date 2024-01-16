import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProjectDetails() {
  //1) creamos estado inicial
  const [project, setProject] = useState({});

  // MOSTRAR ATRIB MtM
  // 1.1) declaramos el estado inicial de las tareas del proyecto
  const [projectTasks, setProjectTasks] = useState([]);

  ///// para redireccionar ///////////////
  let navigate = useNavigate();

  //2) pillamos el id de la URL
  const { id } = useParams();

  //3) hacemos petcición a la API REST
  async function getProject() {
    const response = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`, {
      method: "GET",
    });
    const data = await response.json();
    setProject(data);

    //pillamos las tareas del proyecto (relacion MtM)
    const tasksPromises = data.tasks.map((task_id) => getProjectTasks(task_id));
    const tasksData = await Promise.all(tasksPromises);
    setProjectTasks(tasksData);
  }

  // MOSTRAR ATRIB MtM
  // 3.1) hacemos la peticion a la api para pillar las tareas del proyecto
  async function getProjectTasks(task_id) {
    const response = await fetch(
      `http://127.0.0.1:8000/api/tasks/${task_id}/`,
      {
        method: "GET",
      }
    );
    return response.json();
  }

  //4) llamamos a la funcion en el useEffect
  useEffect(() => {
    getProject();
  }, [id]);

  // IMPLEMENTACION DEL BORRADO DE TAREA
  async function deleteProject() {
    Swal.fire({
      title: "¿Estas seguro de que quieres borrar el proyecto?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://127.0.0.1:8000/api/projects/${id}/`, {
          method: "DELETE",
        });
        navigate("/projects");
        Swal.fire({
          title: "Proyecto eliminado",
          text: "has eliminado el proyecto con éxito",
          icon: "success",
        });
      } else if (result.isDenied) {
        navigate("/");
      }
    });
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
      <h2 className="font-bold text-xl mb-2">
        Detalles del proyecto: {project.title}
      </h2>
      <p className="text-gray-700 text-base">
        Descripcion: {project.description}
      </p>
      <span
        className={`py-1 px-3 rounded-full text-lg ${
          project.done
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-600"
        }`}
      >
        Proyecto {project.done ? "Realizada" : "Pendiente"}
      </span>
      {/* MOSTRAR ATRIB MtM */}
      <h3 className="text-3xl font-medium text-center leading-6 text-gray-900 mb-12 mt-9">
        Lista de tareas del proyecto
      </h3>
      <table className="min-w-max w-full table-auto mx-4">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-center border border-black">#</th>
            <th className="py-3 px-6 text-center border border-black">
              Titulo
            </th>
            <th className="py-3 px-12 text-center border border-black">
              Estado de la tarea
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {projectTasks.map((task, index) => (
            <tr key={index}>
              <td className="py-3 px-6 text-center whitespace-nowrap border border-black text-lg text-blue-500">
                <div className="text-center">
                  <Link
                    to={`/task/${task.id}`}
                    className="font-medium hover:text-blue-400 hover:underline"
                  >
                    {task.id}
                  </Link>
                </div>
              </td>
              <td className="py-3 px-6 text-center border border-black text-lg">
                <div className="flex items-center">
                  <span>{task.title}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-center border border-black text-lg">
                <span
                  className={`py-1 px-3 rounded-full text-lg ${
                    task.done
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-600"
                  }`} // condicional para cambiar el color del estado de la tarea
                >
                  {task.done ? "Realizada" : "Pendiente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <Link
          className="bg-purple-500 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded"
          to={"/projects"}
        >
          Volver al listado
        </Link>
        <Link
          className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
          to={`/editproject/${id}`}
        >
          Editar proyecto
        </Link>
        <button
          className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded"
          onClick={deleteProject}
        >
          Borrar proyecto
        </button>
      </div>
    </div>
  );
}
