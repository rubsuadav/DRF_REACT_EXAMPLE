import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

// para hacer un edit de una entidad simple (es un show + create en el mismo componente)
export default function EditTask() {
  // 1) definimos el estado inicial de la tarea
  const [task, setTask] = useState({
    title: "",
    description: "",
    done: false,
  });

  ///para redireccionar al usuario cuando creemos una tarea exitosa//
  let navigate = useNavigate();

  // 2) pillamos el id de la URL
  const { id } = useParams();

  // 8) agregamos estado inicial de las validaciones
  const [errors, setErrors] = useState({});

  //3) creamos las instancias de los atributos de la entidad
  const { title, description, done } = task;

  // 4) actualizar el estado de la entidad (tarea)
  function handleChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setTask({
      ...task,
      [e.target.name]: value,
    });

    // limpiamos los errores
    setErrors({});
  }

  // 5) hacemos petcición a la API REST
  async function getTask() {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      method: "GET",
    });
    const data = await response.json();
    setTask(data);
  }

  // 6) llamamos a la funcion en el useEffect
  useEffect(() => {
    getTask();
  }, []);

  // 7) llamar al metodo PUT de la API REST
  async function editTask(e) {
    e.preventDefault();
    Swal.fire({
      title: "¿Estas seguro de que quieres editar la tarea?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        //9) validamos los errores del backend
        if (response.status === 400) {
          const data = await response.json();
          setErrors(data);
          return;
        }
        navigate("/tasks");
        Swal.fire({
          title: "Tarea editada",
          text: "has editado la tarea con éxito",
          icon: "success",
        });
      } else if (result.isDenied) {
        navigate("/");
      }
    });
  }

  return (
    //mismo JSX q crear!!!!!!!
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Editar tarea</h2>
        <form onSubmit={(e) => editTask(e)}>
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
            {/* validacion del campo del formulario */}
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="Done"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Hecho
            </label>
            <input
              type="checkbox"
              className="leading-tight text-gray-700"
              name="done"
              checked={done}
              onChange={(e) => handleChange(e)}
            />
            {/* validacion del campo del formulario */}
            {errors.done && (
              <p className="text-red-500 text-xs italic">{errors.done}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-auto px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Editar tarea
            </button>
            <Link
              className="w-auto px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
              to="/tasks"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
