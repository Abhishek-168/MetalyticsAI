import {Routes, Route } from 'react-router-dom'
import './App.css'
import Pinit from './pages/Pinit'
// import Navbar from './Components/Navbar'
import Landing from './pages/Landing'
import InputPage from './pages/Input'
import EnvImpact from './pages/EnvImpact'
import Circularity from './pages/Circularity'
import Results from './pages/Results'
import Chatbot from './Components/chatbot'

function App() {
  

  return (
    <div className="bg-white text-black p-4">
      <Chatbot/>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path ="/input/:id" element={<InputPage />} /> 
          <Route path ="/input/:id/:stage" element={<InputPage />} /> 
          <Route path ="/project/initialise" element={<Pinit />} />
          <Route path = "/results/:id" element={<Results />} />
          <Route path ="/project/results/envimpact/:id" element={<EnvImpact />} />
          <Route path = "/project/results/circularity/:id" element={<Circularity />} />
         {/* <Route path ="/register" element={<>register</>} />          
          <Route path = "/project/impact/:id" element={<>project analytics</>} />
          <Route path = "/project/circularity/:id" element={<>project settings</>} />
          <Route path ="/project/support/:id" element={<>login</>} />
          <Route path ="/project/report/:id" element={<>report</>} />
         <Route path="/about" element={<>about</>} /> */}
        </Routes>
    </div>
  )
}

export default App
