import React from "react";
import { Link } from "react-router-dom";

export default function SuccesPayment() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col justify-between bg-white px-24 py-10 rounded-lg shadow-md h-auto">
        <div>
          <div className="flex justify-center">
            <div className="flex justify-center items-center rounded-full h-40 w-40 bg-green-100 mb-6">
              {/* animate-bounce es pa q se mueva el tick verde, 
              https://tailwindcss.com/docs/animation para ver todas las posibles y como personalizar la tuya propia*/}
              <span className="text-9xl text-green-500 animate-bounce">✓</span>
            </div>
          </div>
          <h1 className="text-4xl text-green-500 font-bold mb-3 text-center">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-gray-700 text-md text-center mb-8">
            El pago se ha realizado correctamente
          </p>
        </div>
        <Link
          to="/"
          className="self-center text-gray-700 bg-gray-200 rounded-lg py-2 px-4 hover:bg-gray-300 "
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
