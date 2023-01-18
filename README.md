# Thrift

This is my fourth project completed during the end of week 11 and all of week 12 (final week) of General Assembly's Software Engineering bootcamp, having spent one and a half weeks learning Python, Django REST Framework and PostgreSQL databases. 

The aim of this project was to create a full-stack application using Django REST Framework to create a PostgreSQL database backend, and React for the frontend. Thrift is an online marketplace where any users can search and browse listings to buy, and if logged in, post listings to sell. The idea for this project came to me one night when I was browsing Facebook Marketplace for a car. 

- **Project timeframe:** 7 days
- **Team size:** Solo project

[Check it out here!](https://thrift-project.herokuapp.com/) (Link not yet live 😢)

![Thrift Landing Page](/readme-images/thrift-1.png)
_&uarr; Landing Page &uarr;_
![Thrift Index Page](/readme-images/thrift-2.png)
_&uarr; Listings by Category Page &uarr;_
![Thrift Single Listing Page](/readme-images/thrift-3.png)
_&uarr; Single Listing Page &uarr;_
![Thrift Login Page](/readme-images/thrift-4.png)
_&uarr; Blogs Index Page &uarr;_
![Thrift Profile Page](/readme-images/thrift-5.png)
_&uarr; Profile Page &uarr;_

#### Technologies Used
- JavaScript
- React
- CSS3, Sass
- Python
- Django / Django REST Framework
- PostgreSQL
- JSON Web Token
- Base64
- Axios
- Material UI
- Insomnia
- TablePlus
- Figma
- Cloudinary
- Git & GitHub


#### Brief
- Build a full-stack application by making your own backend and frontend
- Use an Python Django API to serve your data from a Postgres database
- Consume your API with a separate React frontend
- Be a complete product with multiple relationships and CRUD functionality
- Implement thoughful user stories/wireframes
- Have a visually impressive design
- Be deployed online so it's publicly accessible

---

## Planning

### Wireframe & Pseudocode 

After having decided the concept for the app, I drew out the wireframe using Figma. I browsed the web for similar websites, to get a feel for how the UI and UX is usually designed, but also took inspiration from websites of which I enjoy the UI. I decided that I would need a landing page, a page to display all items listed but divided into their categories and a single item view page. For the logged in users, I would need a profile page, and register/login pages, as well as the ability to add or amend listings. 

![wireframe Page 1](/readme-images/thrift-wireframe-1.png)
![wireframe Page 2](/readme-images/thrift-wireframe-2.png)
_Wireframe_

Additionally, I drew up a diagram of the database, identifying tables/models, the fields they would contain, and the relationships between models, in order that I could better visualise how everything linked together. I identified which relationships were one-to-one, which were one-to-many and which were many-to-many. There are more tables and relationships in the diagram than in the final product however, as time restrictions meant I could not implement them all. 

![relationship diagram](/readme-images/relationships-diagram.png)
_Database diagram_

---

## Build Process

### BACKEND 

### Tables/Models, Serializers and Views

I started by creating the following tables/models within the PostgreSQL database using Django REST Framework:

- **Listing** - the items to advertise and sell
- **Category** - the main categories the listings falls under e.g. electronics, fashion etc
- **Subcategory** - the subcategories the listings falls under e.g. if the category is electronics, the subcategory could be appliances, mobile phones etc
- **Condition** - the conditions of the listings e.g. new or used 
- **User** - the registered users of the app

**Listing Model**

The Listing model extends the ```Model``` class, which is from Django's built-in models package. I defined the fields, and where appropriate and defined the relationship between other tables. This model has a many-to-one relationship with the ```Condition```, ```Subcategory``` and ```User``` models. 

```py
class Listing(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(max_length=5000)
    price = models.DecimalField(max_digits=50, decimal_places=2, validators=[RegexValidator('[.0123456789]')])
    location = models.CharField(max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    condition = models.ForeignKey(
        'conditions.Condition',
        related_name='listings',
        on_delete=models.DO_NOTHING
    )
    subcategory = models.ForeignKey(
        'subcategories.Subcategory',
        related_name='listings',
        on_delete=models.DO_NOTHING
    )
    image = models.CharField(max_length=1000, null=True)
    owner = models.ForeignKey(
        'jwt_auth.User',
        related_name='listings',
        on_delete=models.CASCADE
    )
    featured = models.BooleanField(default=False)
    sold = models.BooleanField(default=False)
```
**Listing Serializers**

Next, I created the ```ListingSerializer```, which is used to convert the Django 'Listing' model instance into JSON. This serializer class extends ```serializers.ModelSerializer```, which is a pre-built serializer class in Django REST Framework. The Meta class specifies that the model that the serializer should use is the Listing model. The fields attribute is set to ```'__all__'```, which means that the serializer will include all the fields of the Listing model.

```py
class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'
```
I also create a ```PopulatedListingSerializer```, which extends the ```ListingSerializer``` above. It includes the same field specified in the above serializer, except that it also includes an additional field called ```owner```, serialized using the ```UserSerializer``` class, which will contain the serialized information about the User who owns the Listing.

```py
class PopulatedListingSerializer(ListingSerializer):
    owner = UserSerializer()
```

**Listing Custom Views**

Next, I created the custom views for the Listing model that act as the controllers, responsible for handling incoming requests and returning appropriate responses. 

The ```ListingListView``` extends the Django REST Franmework ```APIView``` base class. This custom view is responsible for handling GET and POST requests to the ```/listings/``` endpoint of my API. 
```py
class ListingListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        listings = Listing.objects.all()
        serialized_listings = ListingSerializer(listings, many=True)
        return Response(serialized_listings.data)

    def post(self, request):
        request.data['owner'] = request.user.id
        try:
            listing_to_add = ListingSerializer(data=request.data)
            if listing_to_add.is_valid():
                listing_to_add.save()
                return Response(listing_to_add.data, status.HTTP_201_CREATED)
            return Response(listing_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
```
In this view, ```permission_classes``` is set to ```(IsAuthenticatedOrReadOnly, )```. This is to ensure that only authenticated users can perform POST requests, but all users can run GET requests. 

The ```get()``` method here handles the GET requests made to the ```/listings/``` endpoint, and returns all listings to the user. When it is called, it retrieves all 'Listing' objects from the database using the ```Listing.objects.all()``` method, saved as the variable ```listings```. Then, an instance of the ```ListingSerializer``` is created, passing in ```listings``` and ```many=True```, which indicates that the serializer will serialize many instances of the Listing model. Finally, a ```Response``` object containing the serialized data is returned to the user. 

The ```post()``` method handles the POST requests made to the ```/listings/``` endpoint, taking the data in the request body to create a new listing and adding it to the Listing table. When it is called, in the try block, it firstly adds the ```request.user.id``` to the ```request.data``` as the owner field. An instance of the ```ListingSerializer``` is created, and ```request.data``` is passed as the ```data``` argument. A check is performed using the ```is_valid()``` to ensire the data is valid, before saving the serializer and returning ```Response``` object containing the serialized data to the user, along with a status code of ```201 CREATED```. However, if any exception is raised at any point in the process, a ```Response``` object containing the error message with a status code of ```500 INTERNAL SERVER ERROR``` is returned to the user.

The ```ListingDetailView``` below is simlar to the custom view above, the difference being that it is responsible for handling GET, PUT and DELETE requests to the ```/listings/:pk/``` endpoint, which is the endpoint a specific listing. ```:pk``` is the placeholder for a primary key, which in this instance identifies a listing. 

```py
class ListingDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_listing(self, pk):
        try:
          return Listing.objects.get(pk=pk)
        except Listing.DoesNotExist as e:
            raise NotFound(str(e))
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, _request, pk):
        listing = self.get_listing(pk)
        serialized_listing = ListingSerializer(listing)
        return Response(serialized_listing.data)

    def put(self, request, pk):
        try:
            listing = self.get_listing(pk)
            if listing.owner != request.user:
                raise PermissionDenied('Unauthorized')
            serialized_listing_to_update = ListingSerializer(listing, request.data, partial=True)
            if serialized_listing_to_update.is_valid(): 
                serialized_listing_to_update.save()
                return Response(serialized_listing_to_update.data, status.HTTP_202_ACCEPTED)
            return Response(serialized_listing_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    # description: delete a listing
    def delete(self, request, pk):
        try:
            listing_to_delete = self.get_listing(pk)
            if listing_to_delete.owner != request.user:
                raise PermissionDenied('Unauthorized')
            listing_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Listing.DoesNotExist as e:
            raise NotFound(str(e))   
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
```
Again, the ```permission_classes = (IsAuthenticatedOrReadOnly, )``` ensures that while any user can perfrom a GET request, only authorised users can perform PUT and DELETE requests. 

The first ```get_listing()``` is a custom function for returning a singular listing from the database given a primary key. It uses the ```Listing.objects.get()``` method, pasking in the primary key as an argument. If nothing is found, a ```NotFound``` exception is raised. This function is used in the subsequent GET, PUT and DELETE functions in this view, so for the sake of keeping my code DRY, it made sense to create one function to perfrom this step.

The ```get()``` method here handles the GET requests made to the ```/listings/:pk/``` endpoint. It captures the primary key passed in URL of the request and uses it to return the specific listing.

The ```put()``` method here handles the PUT requests made to the ```/listings/:pk/``` endpoint. It uses ```get_listing()``` to first retrieve the listing, then checks if the current user is the owner of the listing. If not, a ```PermissionDenied``` error is raised. If the check passes, then the ```ListingSerializer``` and the data from the request body is used to create a serilaized listing object. The ```partial=True``` argument allows the serializer to update only the fields specified in the request data, rather than replacing all fields. The serialized listing is then validated, saved, and returned to the user with HTTP status code ```202 Accepted```. If validation checks fail,  HTTP status code ```422 Unprocessable Entity``` is returned. 

The ```delete()``` method here handles the PUT requests made to the ```/listings/:pk/``` endpoint. Similar to the ```put()``` method, it checks if the current user is the owner before using ```delete()``` to remove the listing from the database before returning HTTP status code ```204 NO CONTENT``` to the user if deletion is successful.

**User Model**

The User model extends the ```AbstractUser``` model, which is a built-in model in the Django REST Framework that provides basic implementation of a user model. I added custom fields to the User model, such as a telephone number. 

```py
class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    telephone = models.CharField(max_length=11, validators=[MinLengthValidator(11)])
    image = models.CharField(max_length=300, default=None, blank=True, null=True)
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"
```

**User Custom Views**

The ```RegisterView``` extends the ```APIView``` base class, and the ```post()``` method handles POST requests to the ```/register/``` endpoint for new user registration. Firsly, using the request data, an instance of the ```UserRegisterSerializer``` is created, before performing validation checks and saving the new user upon passing. 

```py
class RegisterView(APIView):

    def post(self, request):
        try:
            user_to_register = UserRegisterSerializer(data=request.data)
            if user_to_register.is_valid():
                user_to_register.save()
                return Response('Registration successful', status.HTTP_201_CREATED)
            return Response(user_to_register.errors, status.HTTP_422_UNPROCESSABLE_ENTITY) 
        except Exception as e:
            print(e)
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
```
The ```LoginView``` also extends the ```APIView``` base class, and handles POST requests to the ```/login/``` endpoint for users logging in. The ```post()``` method firstly retrieves the the email and password from the request data, then looks for a user matching the email address in the database, using the ```User.objects.get()``` method. If no user is found, a ```PermissionDenied``` error is raised. If a user is found though, it then checks if the provided password matches the hashed password stored in the database for that user. If the passwords do not match, a ```PermissionDenied``` error is raised. If the passwords match, it creates a JSON Web Token using the jwt library, containing the user's id and an expiration date set 7 days in the future. The JWT is then encoded using the ```SECRET_KEY``` and the HS256 algorithm, before finally returning to the user a ```Response``` object containing a message with the user's name and the JSON Web Token, along with the HTTP status code set to ```202 ACCEPTED```.

```py
class LoginView(APIView):   
    
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        try:
            user_to_login = User.objects.get(email=email)
        except User.DoesNotExist as e:
            raise PermissionDenied('Invalid credentials')
        
        if not user_to_login.check_password(password):  
            raise PermissionDenied('Invalid credentials')

        dt = datetime.now() + timedelta(days=7)  
        dt_as_seconds = int(dt.strftime('%s'))
        token = jwt.encode(
          { 'sub': user_to_login.id, 'exp': dt_as_seconds },
          settings.SECRET_KEY,
          'HS256'
        )  

        return Response({
            'message': f'Welcome back, {user_to_login.first_name}',
            'token': token
        }, status.HTTP_202_ACCEPTED)
```

### Authentication

To build custom authentication behaviour, I defined ```JWTAuthentication``` to extend Django REST Framework's ```BaseAuthentication``` class. 
1. First, I checked if the request has headers. 
2. If headers were present, I would check if the headers contained an ```Authorization``` header. 
3. If the ```Authorization``` header was present, I would make sure it was in the correct format, starting with ```'Bearer '```.
4. If that passed the check too, then I would extract the token by replacing ```'Bearer '``` with an empty string ```''```, and saving that to the variable ```token```. 
5. Next, in the try block, I used the JWT library to decode the token using the ```SECRET_KEY```.
6. If the token is valid, I used the ```sub``` from the payload to find the user in the database and return the user and token.

```py
class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):

        if not request.headers:
            return None

        headers = request.headers.get('Authorization')
        if not headers:
            return None

        if not headers.startswith('Bearer '):
            raise PermissionDenied('Invalid Token')

        token = headers.replace('Bearer ', '')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, 'HS256')
            user = User.objects.get(pk=payload['sub'])
        except User.DoesNotExist as e:
            raise PermissionDenied('User not found')
        except Exception as e:
            print(e)
            raise PermissionDenied(str(e))
        
        return (user, token)
```        

### FRONTEND 

The bulk of the time I had for this project was spent on the frontend. For the frontend of this project, I decided to try out Material UI's components. I also included separate CSS files for each different components and pages, which made the while app easier to style and manage. 

I started by building the browser router from ```react-router-dom```. 
```js
<Routes>
  <Route exact path='/' element={<HomeView />} />
  {categoryRoutes.map((category) => (
    <Route
      exact
      path={`/${category}`}
      element={<CategoryView bannerText={category} categoryRoutes={categoryRoutes} />}
    />
  ))}
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
```
A point of note here are the routes for each category, created by mapping through the ```categoryRoutes```, which is also used later on. 
```js
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
```
### The NavBar

**Icons**

While the NavBar icons remain the same for both authorised and unauthorised users, the tooltips used shows different information, and so does the destination when clicked. The profile icon will show 'Login / Register' for unauthorised users, and 'My Profile' for logged in users. 

When an unauthorised users clicks the sell icon, it will automatically take them to the log in page, where there is also an option to register an account. If an authorised user does the same, it will take them to a form page where they can fill in the details of the listing. Similarly, when an unauthorised users clicks the profile icon, it takes them to log in, but if already logged in, it shows them their profile page with their account details and their listings. 

```js
<AddCircle onClick={!isAuthenticated() ? () => navigate('/login') : () => navigate('/sell')} />
```
```js
<Tooltip title={isAuthenticated() ? 'My Profile' : 'Log In / Register' }>
  <IconButton>
    <AccountCircle onClick={isAuthenticated() ? () => navigate('/myprofile') : () => navigate('/login')} />
  </IconButton>
</Tooltip>
```

**Search Bar**

To create the search bar, since I was short on time, I decided that rather than showing the results on a separate page (I didn't have time to design the UI for a new page that made sense for this app), the search bar and it's results would be it's own component. 

1. I sent a GET request to the database and saved all the listings in the ```listings``` state. 

```js
const [ listings, setListings ] = useState([])
const [ filteredListings, setFilteredListings ] = useState([])
const [ searched, setSearched ] = useState('')
```

2. The ```handleSearchInput``` function is run when the ```onKeyPress``` event listener is triggered, but doesn't do anythingunless they key is the 'Enter' key. By pressing the 'Enter' key, the value of the seach updates the ```searched``` variable. 
```js
<StyledInputBase
  placeholder='Search…'
  inputProps={{'aria-label': 'search'}}
  onKeyPress={handleSearchInput}
  onClick={handleSearchClick}
/>
```
```js
const handleSearchInput = (e) => {
  if (e.key === 'Enter') {
    setSearched(e.target.value)
  }
}
```
3. The function ```filterByTitle``` is run in the ```useEffect``` hook whenever the ```searched``` state is updated. It matches the search with the items in the ```listings``` array via the ```filter``` method, and returns the matches in an array. I then set this to ```filteredListings```, capping the number of returned results to be displayed at 8. 

```js
const filterByTitle = () => {
    const regex = new RegExp(searched, 'i')
    const matchingProducts = listings.filter(listing => {
      return regex.test(listing.title)
    })
    setFilteredListings(matchingProducts.slice(0,8))    
  }
```
```js
useEffect(() => {
  filterByTitle()
}, [searched])
```

### Listings Index Page

What separates this index page from my previous projects is that instead of displaying all the listings here, I have decided that listings are by default already sorted into their categories. Users click through to each category via the category bar below the NavBar. 

```js
  const handleDirectToCategoryView = (e) => {
    const {textContent: path} = e.target
    navigate(`/${path.toLowerCase()}`)
  }

  const categoryBar = categoryRoutes.map((category) => (
    <span onClick={handleDirectToCategoryView} key={category}>
      {category}
    </span>
  ))
```
In a useEffect, I send a GET request to the ```/api/categories/``` endpoint, which returns each category populated with the listings that falls under that category. I then find the use the ```find()``` method to look the category selected by the user, which I then map through to return each listing to be displayed.  

```js
useEffect(() => {
  const getListings = async () => {
    try {
      const { data } = await axios.get('/api/categories/')
      setListings(data)
    } catch (err) {
      console.log(err)
    }
  }
  getListings()
}, [])
```
There is also a feature where each time a different category is picked, the banner image changes to a relevant image. To achieve this, I simply import the images into the component, then I create an array of objects matching each category picked (saved to the variable to ```pathname```) to the url, which is what I have imported the image as. In the code snippet below, I have taken the first four as an example. 

```js 
  const bannerImage = [
    {
      path: '/home%20&%20garden',
      url: homegarden
    },
    {
      path: '/electronics',
      url: electronics
    },
    {
      path: '/fashion',
      url: fashion
    },
    {
      path: '/sports%20&%20leisure',
      url: sportsleisure
    }
  ]
```
The ```getImageUrlPath``` function then finds the corresponding ```url``` to be used later in the JSX return. 
```js
  const getImageUrlPath = () => {
    const findBannerObject = bannerImage.find(item => item.path === pathname)
    return findBannerObject.url
  }
```

**Filters**

Users have the ability to filter the results based on 
- Subcategory of the listing
- Condition of the items
- Price

Users must select one subcategory, multiple conditions, and price range of £0 to £2500 each time they run the filter.  

1. To create the filter function, first I set in state the filter requirements, which are empty (or false for booleans) to start with.
```js
  const [selectedFilters, setSelectedFilters] = useState({
    subcategory: '',
    condition: [],
    price: ''
  })
```
2. The ```onChangeFilters``` function takes a ```key``` and ```value``` as its arguments. The function is called a change is made to the filter. The ```key``` that is passed in as the argument will match one of the keys in the ```selectedFilters``` state. The ```value``` is the option that is passed through, which is the specifics the user has chosen to filter. They user's choices are then used to update the ```selectedFilters``` state.

```js
const onChangeFilters = (key, value) => {
  if (key === 'condition') {
    const {condition} = selectedFilters;
    const updatedSelectedConditions = condition.includes(value)
      ? condition.filter((c) => c !== value)
      : [...condition, value]
    return setSelectedFilters({
      ...selectedFilters,
      condition: updatedSelectedConditions
    })
  }
  return setSelectedFilters({...selectedFilters, [key]: value})
}
```
3. The ```applyFilters``` runs when the 'apply' button at the bottom of the filters is clicked. Firstly, ```price```, ```condition``` and ```subcategory``` are destructured from ```selectedFilters```. The ```filter()``` method is used on ```rawListings```, which is an array containing the listings given a certain category, and filters for listings that match the chosen ```subcategory```, ```condition``` chosen and has a price below the ```price``` specified in the filter. The results returned are then used to update ```categorisedListings```, which is then used to display to the user. 
```js
  const [categorisedListings, setCategorisedListings] = useState([])
```
```js
  const applyFilters = () => {

    const {price, condition, subcategory} = selectedFilters

    const filteredListings = rawListings.filter(listing => {
      const findSubcategoryIndex = subcategoriesIndexed[bannerText.toLowerCase().replaceAll(' ','')].find(category => category.value === listing.subcategory)?.label
      const findConditionIndex = conditions[listing.condition - 1]
      return findSubcategoryIndex === subcategory && (condition.length === 0 || condition.includes(findConditionIndex)) && parseFloat(listing.price) <= price
    })  

    setCategorisedListings(filteredListings)
  }
```
**Sort**

Users have the ability to sort the results based on 
- Alphabetical order 
- Reverse alphabetical order
- Highest price first
- Lowest price first
- Recently added first

1. To create this function, first I display the dropdown to the user. 

```js
<select
  onChange={(e) => sortListingsByDropdownOption(e.target.value)
  }
>
  <option value='a-z'>A-Z</option>
  <option value='z-a'>Z-A</option>
  <option value='highest price'>Highest Price</option>
  <option value='lowest price'>Lowest Price</option>
  <option value='added'>Newly Added</option>
</select>
```
2. The ```sortListingsByDropdownOption()``` function takes the ```value``` of the option as the argument, and will sort the displayed listings according to the option chosen. 
```js
const forceUpdate = useCallback((arr) => setCategorisedListings(arr), [])

const sort = (sortFn, prev) => prev.sort(sortFn)

const sortListingsByDropdownOption = (value) => {
    const sortFnMap = {
      'a-z': (a,b) => a.title.localeCompare(b.title),
      'z-a': (a,b) => b.title.localeCompare(a.title),
      'highest price': (a,b) => parseFloat(b.price) - parseFloat(a.price),
      'lowest price': (a,b) => parseFloat(a.price) - parseFloat(b.price),
      'added': (a,b) => new Date(b.created_at) - new Date(a.created_at)
    }
    return forceUpdate(sort(sortFnMap[value] , categorisedListings))
}
```

### Single Listing Page

At the bottom of the Single Listing page, the ```isOwner``` function checks to see whether the current user is the owner of the listing displayed. If so, there will be an 'Edit or delete' button for that product, where the user can go through and amend the listing or delete it altogether. If it's not the owner, then there is an option to contact the owner. When this button is clicked, a modal appears with the seller's contact information. 

```js
(isOwner(listing.owner) ?
<Button text={`Edit or delete`} type='primary' onClick={() => navigate(`/${productId}/edit`)} />
:
<div>
  <Button onClick={handleOpen} text={`Contact ${listing && users ? itemOwner.first_name : ''}`} />
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
        <h6>Seller: {listing && users ? `${itemOwner.first_name} ${itemOwner.last_name}` : ''}</h6>
        <br/>
        <p>Email: {listing && users ? itemOwner.email : ''}</p>
        <p>Telephone: {listing && users ? itemOwner.telephone : ''}</p>
    </Box>
  </Modal>
</div>
)
```

### Bugs

- The search bar has a few bugs. It may need a couple clicks to get it to start working. Whilst users can make a search anywhere on the site, clicking through to a specific listing only works from pages that are not single listing display pages. The URL changes, but the app does not navigate there automatically.
- The below code will each time the user clicks out of the search bar results. However, with each click (after searching) the code will run ```i++``` times. Refreshing the page will reset this. 
```js
const clickOutDropdown = (e) => {
  if (e.target.classList.contains('search-list-input')) return
  if (!e.target.classList.contains('MuiInputBase-input') && isClickOutAdded) {
    setClicked(false)
    setFilteredListings([])
    setSearched('')
    setIsClickOutAdded(false)
  }
}
```
- The sort function will not automatically render the results in the correct order. However, I have found that changing the screen size even just a little will help the correctly sorted display render.
- When using the filter, both the Categories and Price filter must have a selection in order to work. 
- When editing a lisitng, ```condition```, ```category```, ```subcategory``` and ```image``` does not pre-populate, although they are all there. 

---

## Reflection

### Challenges 

- Working on a full-stack app alone for the first time was challenging, as there are no team mates to help when needed and to bounce ideas off of. I also had to organise my time well, as I would be responsible for the entire product. Time management was important, drawing on my experience on previous projects to gauge roughly how long I had to apportion between tasks. However, I did find some freedom in working alone, as there would be no chance of conflicting ideas and code in the project.
- Using Python, Django REST Framework and PostgreSQL after only having learnt it for about a week was a challenge. This meant I came across many problems that I was unfamiliar with. Searching for answers on the internet can be difficult if the terminology is not correct or specific enough, so this project really challenged me to use the correct language and put my problems into words when searching for solutions.

### Wins

- I am pleased with the aesthetic of the final product, and seeing my vision from the start come to fruition. I especially like the banner that changes with each category selection. 
- In this project, I split up the individual components such as buttons, forms etc. and the individual pages. I also included separate CSS files for each component and page. This meant more reusable components, which was more organised and easier to manage, especially for larger projects. It helped with keeping a consistent look and feel throught the app, and cut down some work by keeping code DRY. 
- Being able to create a Django/PostgreSQL backend, having only learnt everything for under 2 weeks was a huge confidence boost for me.

### Key Takeaways

- Learning to use Django and PostgreSQL to create a backend, and building relational databases. This helped me to increase my understanding of building databases by learning another language. 
- Further developed my understanding of using TablePlus and using SQL to query the database I built, even though SQL was not used as such in this project.
- The importance of organising code into manageable and easy to understand portions, so that when there are many moving parts coming together, I and others reading the code can still understand what is happening.

### Future Improvements

- Include a review section where users can rate each other and include a star rating which will be visible to others.
- Be able to upload multiple images per listing. 
- Use pagination for the index view where many listings may load.
- Be able to include multiple or more complex categories/subcategories.
- The ability for users to favourite/save listings in a wishlist. My plans originally included this feature, but I did not have the time to implement it.
- Where users can currently see the contact details when they press 'Contact Seller', I want to implement an email function there, so users can directly email sellers from the app. 