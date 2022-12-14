import {routes} from './routes';
import {BrowserRouter as Router} from 'react-router-dom';
import './styles.css';

// components
import NavBar from './components/NavBar';
import CategoryBar from './components/CategoryBar';

const App = () => {
  return (
    <Router>
      <NavBar />
      <CategoryBar />
      {routes}
    </Router>
  );
};

export default App;
