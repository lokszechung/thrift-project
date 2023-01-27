import React from 'react'
import './styles.scss'
import {subcategories, conditions} from './subcategories'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import Button from '../button'

const ProductFilterBar = ({
  route,
  handleClear,
  sellerCategories,
  onChangeFilters,
  selectedFilters,
  showFilterModal,
  applyFilters,
  isModal
}) => {
  const {subcategory, price, radius} = selectedFilters
  const subcategoriesToMapThrough = route
    ? subcategories[route]
    : sellerCategories

  const listOfSubCategories = subcategoriesToMapThrough.map((category) => (
    <div
      onClick={() => onChangeFilters('subcategory', category)}
      className={`category-row ${subcategory === category ? 'selected' : ''}`}
    >
      <p>{category}</p>
      {/* TODO: slot in number of items per category */}
      {/* <span>20</span> */}
    </div>
  ))

  const getConditionCheckBoxes = conditions.map((condition) => (
    <div className='checkbox-row'>
      <input
        type='checkbox'
        checked={selectedFilters.condition.includes(condition)}
        onChange={() => onChangeFilters('condition', condition)}
      />
      <p>{condition}</p>
    </div>
  ))

  const buildRangeSlider = (min, max, labels, value) => {
    const [minRangeLabel, maxRangeLabel] = labels
    const isPriceSlider = minRangeLabel.includes('£')
    return (
      <Stack spacing={3} direction='row' sx={{mb: 1}} alignItems='center'>
        <span>{minRangeLabel}</span>
        <Slider
          getAriaValueText={() => value}
          valueLabelDisplay='auto'
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const key = isPriceSlider ? 'price' : 'radius'
            return onChangeFilters(key, e.target.value)
          }}
        />
        <span>{maxRangeLabel}</span>
      </Stack>
    )
  }

  let containerClassName = 'filter-bar-container'

  if (!showFilterModal) {
    containerClassName += ' closed'
  }
  // if (isSticky) {
  //   containerClassName += ' sticky'
  // }
  if (isModal) {
    containerClassName += ' modal-view'
  }

  return (
    <div className={containerClassName}>
      <div className='category-selection'>
        <h6>Categories</h6>
        <ul>{listOfSubCategories}</ul>
      </div>

      <div className='secondary-filters'>
        <h6>Filter by</h6>

        <p className='secondary-filter-title'>CONDITION</p>
        {getConditionCheckBoxes}

        <p className='secondary-filter-title'>PRICE</p>
        {buildRangeSlider(0, 2500, ['£0', '£2500'], price)}

        {/* <p className='secondary-filter-title'>RADIUS</p>
        {buildRangeSlider(0, 2500, ['0km', '2500km'], radius)} */}
      </div>

      <div className='action-buttons'>
        <Button onClick={handleClear} type='secondary' includeSideMargins text='Clear' />
        <Button onClick={applyFilters} type='primary' text='Apply' />
      </div>
    </div>
  )
}

export default ProductFilterBar
