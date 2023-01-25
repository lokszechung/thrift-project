import {Routes, Route} from 'react-router-dom'

// Views
import HomeView from './views/homeView'
import CategoryView from './views/categoryView'
import ProductView from './views/productView'
import UserView from './views/userView'
import RegisterView from './views/registerView'
import LoginView from './views/loginView'
import SellView from './views/sellView'
import ProfileView from './views/profileView'
import ProductEditView from './views/productEditView'
import NotFoundView from './views/notFoundView'
import SavedView from './views/savedView'
// category routes
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
