import {routes} from './routes'
import {BrowserRouter as Router} from 'react-router-dom'
import './styles.css'

// components
import NavBar from './components/navBar'
import CategoryBar from './components/categoryBar'

const App = () => {
  return (
    <Router>
      <NavBar />
      <CategoryBar />
      {routes}
    </Router>
  )
}

export default App
