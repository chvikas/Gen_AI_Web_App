import './App.css';

function App() {
  // const [count, setCount] = useState(0)

  return (
   <div className='main-container'>
    <h1>Gen AI Web App</h1>
    <div className='form-container'>
      <div>
        <label>Enter Query:</label>
        <input className="query-input" type="text" placeholder="Enter something"/>
      </div>

    </div>

   </div>
  );
}

export default App;
