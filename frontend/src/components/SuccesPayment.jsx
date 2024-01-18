import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SuccesPayment() {
  let navigate = useNavigate();
  const customerId = localStorage.getItem("customer_id");

  async function getCustomerInvoice() {
    const response = await fetch(
      `http://localhost:8000/api/invoice/${customerId}/`
    );
    const data = await response.json();

    return data;
  }

  async function handleInvoice() {
    if (customerId !== null) {
      const data = await getCustomerInvoice();
      if (data["url de la factura"]) {
        Swal.fire({
          title: "Factura generada",
          icon: "success",
          html: `<p class="text-justify text-green-500">Factura generada con éxito</p>`,
        });
        localStorage.removeItem("customer_id");
        window.open(data["url de la factura"], "_blank"); // _blank para q se abra en otra pestaña
        navigate("/");
      }
      navigate("/");
    } else {
      Swal.fire({
        title: "Aviso",
        icon: "info",
        html: `<p class="text-justify text-red-500"> No puedes generar una factura si no has realizado una compra.
       Si has conseguido llegar hasta aqui sin pagar es porque has adivinado la URL de redireccion y quieres hacer hacking 
       e intentar generar una factura que no es tuya, pero está todo validado y no podrás hacerlo.
       </p>`,
      }).then(() => {
        navigate("/");
      });
    }
  }

  function navigateToHome() {
    if (localStorage.getItem("customer_id") !== null) {
      localStorage.removeItem("customer_id");
    }
  }

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
          to={"/"}
          onClick={navigateToHome}
          className="self-center text-gray-700 bg-gray-200 rounded-lg py-2 px-4 hover:bg-gray-300 mb-4"
        >
          Volver al inicio
        </Link>
        <Link
          className="self-center text-gray-700 bg-red-200 rounded-lg py-2 px-4 hover:bg-red-300"
          onClick={handleInvoice}
        >
          Generar factura del recibo
        </Link>
      </div>
    </div>
  );
}
