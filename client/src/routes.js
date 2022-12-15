import {Routes, Route} from 'react-router-dom'

// Views
import HomeView from './views/HomeView'
import CategoryView from './views/CategoryView'
import ProductView from './views/ProductView'
import UserView from './views/UserView'
import RegisterView from './views/RegisterView'
import LoginView from './views/LoginView'

export const categoryRoutes = [
  'Home & Garden',
  'Electronics',
  'Fashion',
  'Sports & Leisure',
  'Health & Beauty',
  'Toys',
  'Motors',
  'Collectibles',
  'Property',
  'Jobs',
  'Pets'
]

export const routes = (
  <Routes>
    <Route exact path='/' element={<HomeView />} />
    {categoryRoutes.map((category) => (
      <Route
        exact
        path={`/${category}`}
        element={<CategoryView bannerText={category} categoryRoutes={categoryRoutes} />}
      />
    ))}
    <Route exact path='/listings/:category/:productId' element={<ProductView />} />
    <Route exact path='/:productId' element={<ProductView />} />
    <Route exact path='/chilli/:userId' element={<UserView />} />
    <Route exact path='/register' element={<RegisterView />} />
    <Route exact path='/login' element={<LoginView />} />
  </Routes>
)
