import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../authContext";

export default function ProtectedRoute() {
  const { isAuthenticated /*isCaptain, isSupervisor */ } = useAuthContext();

  if (
    !isAuthenticated
    /*   (localStorage.getItem("role") !== "capitán" &&
    localStorage.getItem("role") !== "supervisor")* */
  ) {
    //cambiamos la condicion en funcion de q roles tienen permiso
    return <Navigate to={"/"} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
