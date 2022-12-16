import './styles.scss'

import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'


const NotFoundView = () => {

  const navigate = useNavigate()

  return (
    <div className='not-found-container'>
      <div className='image-container'></div>
      <div>
        <h2>Not Found</h2>
        <p>How did you end up here?</p>
        <Button text='Home' onClick={() => navigate('/')}/>
      </div>
    </div>
  )


}

export default NotFoundView