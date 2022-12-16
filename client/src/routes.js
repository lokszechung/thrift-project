import {Routes, Route} from 'react-router-dom'

// Views
import HomeView from './views/HomeView'
import CategoryView from './views/CategoryView'
import ProductView from './views/ProductView'
import UserView from './views/UserView'
import RegisterView from './views/RegisterView'
import LoginView from './views/LoginView'
import SellView from './views/SellView'
import ProfileView from './views/ProfileView'
import ProductEditView from './views/ProductEditView'
import NotFoundView from './views/NotFoundView'
import SavedView from './views/SavedView'

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
    {/* <Route exact path='/listings/:category/:productId' element={<ProductView />} /> */}
    <Route exact path='/listings/:productId' element={<ProductView />} />
    <Route exact path='/chilli/:userId' element={<UserView />} />
    <Route exact path='/myprofile' element={<ProfileView />} /> 
    <Route exact path='/register' element={<RegisterView />} />
    <Route exact path='/login' element={<LoginView />} />
    <Route exact path='/sell' element={<SellView />} />
    <Route exact path='/:productId/edit' element={<ProductEditView />} />
    <Route exact path='/saved' element={<SavedView />} />
    <Route path='*' element={<NotFoundView />} />


  </Routes>
)
