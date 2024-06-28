import { BrowserRouter, Route, Routes } from "react-router-dom"
import Forms from "./pages/Forms"
import Roompage from "./pages/Roompage"
import Signup from "./pages/Signup"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Forms />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/:id" element={<Roompage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
