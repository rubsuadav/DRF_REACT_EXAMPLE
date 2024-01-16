import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

// show de tareas
export default function TaskDetails() {
  //1) creamos estado inicial
  const [task, setTask] = useState({});

  ///// para redireccionar ///////////////
  let navigate = useNavigate();

  //2) pillamos el id de la URL
  const { id } = useParams();

  //3) hacemos petcición a la API REST
  async function getTask() {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      method: "GET",
    });
    const data = await response.json();
    setTask(data);
  }

  //4) llamamos a la funcion en el useEffect
  useEffect(() => {
    getTask();
  }, [id]);

  // IMPLEMENTACION DEL BORRADO DE TAREA
  async function deleteTask() {
    Swal.fire({
      title: "¿Estas seguro de que quieres borrar la tarea?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
          method: "DELETE",
        });
        navigate("/tasks");
        Swal.fire({
          title: "Tarea eliminada",
          text: "has eliminado la tarea con exito",
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
        Detalles de la tarea: {task.title}
      </h2>
      <p className="text-gray-700 text-base">Descripcion: {task.description}</p>
      <span
        className={`py-1 px-3 rounded-full text-lg ${
          task.done ? "bg-green-200 text-green-800" : "bg-red-200 text-red-600"
        }`}
      >
        Tarea {task.done ? "Realizada" : "Pendiente"}
      </span>
      <div className="mt-4 flex justify-between">
        <Link
          className="bg-purple-500 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded"
          to={"/tasks"}
        >
          Volver al listado
        </Link>
        <Link
          className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
          to={`/edittask/${id}`}
        >
          Editar tarea
        </Link>
        <button
          className="bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded"
          onClick={deleteTask}
        >
          Borrar tarea
        </button>
      </div>
    </div>
  );
}
