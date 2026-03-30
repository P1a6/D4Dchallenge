import Navbar from './components/Navbar'
import './index.css'

import HomePage from './pages/Homepage'
import { Routes, Route } from 'react-router-dom'
import TaskOverview from './pages/TaskOverview'
import CalculatorPage from './pages/Calculator'

function App() {

  return (
  <>
   <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/task-overview" element={<TaskOverview />} />
        </Routes>
      </main>
      
    </div>
  </>
  )
}

export default App