import { createContext } from "react";

const MyContext = createContext<
  [ { isTrue: boolean, id: number }?, // nova propriedade adicionada aqui
  React.Dispatch<React.SetStateAction<{ isTrue: boolean, id: number }>>?]
>([{ isTrue: false, id: -1 }, () => {}]);

export default MyContext;
