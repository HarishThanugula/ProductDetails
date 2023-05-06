import './index.css'

const SimilarProductItem = props => {
  const {similarProductsItem} = props
  const {imageUrl, title, rating, brand, price} = similarProductsItem

  return (
    <li className="similar-item">
      <img src={imageUrl} alt="similar product" className="image-details" />
      <h1 className="heading">{title}</h1>
      <p>{brand}</p>
      <p>Rs {price} /-</p>
      <div className="item-rating-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
          className="rating-details-image"
        />
        <p className="rating">{rating}</p>
      </div>
    </li>
  )
}

export default SimilarProductItem
