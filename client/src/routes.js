import {Routes, Route} from 'react-router-dom';

// Views
import HomeView from './views/HomeView';
import CategoryView from './views/CategoryView';
import ProductView from './views/ProductView';
import UserView from './views/UserView';

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
];

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
    <Route path='/:productId' element={<ProductView />} />
    <Route path='/user/:userId' element={<UserView />} />
  </Routes>
);
