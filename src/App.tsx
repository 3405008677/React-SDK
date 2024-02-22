import type { PropsType, MyType } from "#/src/App";
import { useState, FC } from "react";

const App: FC<PropsType> = props => {
  const [count, setCount] = useState(18);
  let obj: MyType = {
    name: "PQJ",
    age: count,
    address: "深圳",
  };
  console.log(props.isActive);
  return (
    <>
      <h1 onClick={() => setCount(() => obj.age + 1)}>Vite + React {obj.age}</h1>
      <h1>{props.title}</h1>
    </>
  );
};

export { App };
