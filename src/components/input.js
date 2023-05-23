import React from "react";

export default function Input({ value, setValue }) {
  return (
    <input value={value} onChange={(e) => setValue(e.target.value)}></input>
  );
}
