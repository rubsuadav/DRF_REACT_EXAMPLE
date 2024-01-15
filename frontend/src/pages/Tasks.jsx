import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// obtener todas las tareas (GET ALL)
export default function Tasks() {
  // 1) Crear estado inicial
  const [tasks, setTasks] = useState([]);

  // 2) llamada a la API REST
  async function getAllTasks() {
    const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
      method: "GET",
    });

    const data = await response.json();

    //3) setear
    setTasks(data);
  }

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h3 className="text-3xl font-medium text-center leading-6 text-gray-900 mb-12">
        Lista de tareas
      </h3>
      <div>
        {/* overflow-x-auto para desplazar de der a izq */}
        <div className="w-full">
          <table className="min-w-max w-full table-auto mx-4">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center border border-black">
                  Número de la tarea
                </th>
                <th className="py-3 px-6 text-center border border-black">
                  Titulo
                </th>
                <th className="py-3 px-12 text-center border border-black">
                  Estado de la tarea
                </th>
                <th className="py-3 px-12 text-center border border-black ">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td className="py-3 px-6 text-center whitespace-nowrap border border-black text-lg text-blue-500">
                    <div className="text-center">
                      <Link
                        to={`/task/${task.id}`}
                        className="font-medium hover:text-blue-400 hover:underline"
                      >
                        {index + 1}
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
                  <td
                    className={`py-3 px-6 text-center border-r border-black text-lg ${
                      index === tasks.length - 1 ? "border-b" : ""
                    }`} // condicional para agregar el borde inferior a la ultima fila de la tabla
                  >
                    {index === 0 && (
                      <div className="flex flex-col justify-end items-end space-y-4">
                        <Link
                          to={"/createtask"}
                          className="py-1 px-3 text-lg bg-blue-100 text-blue-600 hover:text-black font-bold"
                        >
                          Crear nueva tarea
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
