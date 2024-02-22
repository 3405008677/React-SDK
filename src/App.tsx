import type { PropsType, MyType } from "#/src/App";
import { useState, FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./store/features/counterSlice.ts";

const App: FC<PropsType> = props => {
  const [count, setCount] = useState(18);
  let obj: MyType = {
    name: "PQJ",
    age: count,
    address: "深圳",
  };
  console.log(props.isActive);

  const countRedux = useSelector(state => state.counter.value);
  const dispatchRedux = useDispatch();

  return (
    <>
      <h1 onClick={() => setCount(() => obj.age + 1)}>Vite + React {obj.age}</h1>
      <h1 onClick={() => dispatchRedux(increment())}>{countRedux}</h1>
    </>
  );
};

export { App };
