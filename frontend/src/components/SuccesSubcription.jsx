import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SuccesSubcription() {
  let navigate = useNavigate();

  function navigateToHome() {
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col justify-between bg-white px-24 py-10 rounded-lg shadow-md h-auto">
        <div>
          <div className="flex justify-center">
            <div className="flex justify-center items-center rounded-full h-40 w-40 bg-gray-100 mb-6">
              <span className="text-9xl text-green-500 animate-bounce">✓</span>
            </div>
          </div>
          <h1 className="text-4xl text-green-500 font-bold mb-3 text-center">
            Gracias por suscribirse
          </h1>
          <p className="text-gray-700 text-md text-center mb-8">
            Tu suscripcion ha sido realizada con exito
          </p>
        </div>
        <Link
          to={"/"}
          onClick={navigateToHome}
          className="self-center text-gray-700 bg-gray-200 rounded px-4 py-2 hover:bg-gray-300 mb-4"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
