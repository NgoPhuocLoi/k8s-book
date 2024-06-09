import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [allValues, setAllValues] = useState([]);
  const [currentValues, setCurrentValues] = useState([]);
  const inputRef = useRef(null);
  const API_URL = "/api";

  const getAllValues = async () => {
    try {
      const res = await axios.get(API_URL + "/values/all");
      console.log(res.data);
      setAllValues(res.data.values.map((val) => val.number));
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentValues = async () => {
    try {
      const res = await axios.get(API_URL + "/values/current");
      setCurrentValues(
        Object.keys(res.data.values).map((key) => ({
          index: key,
          value: res.data.values[key],
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchValues() {
    return await Promise.all([getAllValues(), getCurrentValues()]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const index = inputRef.current.value;
    try {
      await axios.post(API_URL + "/values", {
        index,
      });
      await fetchValues();
      inputRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchValues();
  }, []);

  return (
    <>
      <h1>Fib calculator v2</h1>

      <div>
        <span>Enter your index: </span>
        <input ref={inputRef} type="text" />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div>
        <h3>Indicies I have seen:</h3>
        <div>
          {allValues.map((val, index) => (
            <span key={index}>{val},</span>
          ))}
        </div>
      </div>

      <div>
        <h3>Calculated values</h3>
        <ul>
          {currentValues.map((val) => (
            <li key={val.index}>
              Index: {val.index} = {val.value}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
