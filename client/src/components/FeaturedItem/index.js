import { useEffect, useState } from 'react'
import './styles.scss'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'



const FeaturedItem = ( { image, price, title, owner, id } ) => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get('api/auth/users')
        setUsers(data)
      } catch (err) {
        console.log(err)
      }
    }
    getUsers()
  },[])

  const itemOwner = users.find(user => user.id === owner )

  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/${id}`)} className='image-card-container'>
      <div className='image-container'>
        <img
          src={image}
          alt='product-item'
        />
      </div>

      <div className='item-text'>
        <p>
          {title}
          <span className='seller'>
            Listed by
            <Link to={`/user/${owner}`}>{itemOwner ? `${itemOwner.first_name} ${itemOwner.last_name}` : null}</Link>
          </span>
        </p>
        <span>£{price % 1 === 0 ? price.split('.')[0] : price}</span>
      </div>
    </div>
  )
}

export default FeaturedItem
