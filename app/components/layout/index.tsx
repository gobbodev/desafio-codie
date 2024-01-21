import Center from "./center";
import MyContext from "../context/todo";
import { useState } from "react";

export default function Layout() {
  const [showPass, setShowPass] = useState({isTrue: false, id: -1 });

  return (
    <MyContext.Provider value={[showPass, setShowPass]}>
      <Center/>
    </MyContext.Provider>
  );
  /*Provider disponibiliza os valores para as crianças do MyContext :)*/
}
