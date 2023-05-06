import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusContent = {
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    count: 1,
    apiStatus: apiStatusContent.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onClickIncrease = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`

    this.setState({apiStatus: apiStatusContent.inProgress})

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        imageUrl: fetchedData.image_url,
        id: fetchedData.id,
        price: fetchedData.price,
        rating: fetchedData.rating,
        similarProducts: fetchedData.similar_products,
        totalReviews: fetchedData.total_reviews,
        title: fetchedData.title,
      }

      const getSimilarProducts = updatedData.similarProducts.map(
        eachProduct => ({
          imageUrl: eachProduct.image_url,
          title: eachProduct.title,
          brand: eachProduct.brand,
          price: eachProduct.price,
          rating: eachProduct.rating,
          id: eachProduct.id,
        }),
      )

      this.setState({
        productDetails: updatedData,
        similarProducts: getSimilarProducts,
        apiStatus: apiStatusContent.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusContent.failure})
    }
  }

  renderProductDetailsView = () => {
    const {productDetails, count, similarProducts} = this.state
    console.log(similarProducts)
    const {
      availability,
      brand,
      rating,
      price,
      imageUrl,
      description,
      totalReviews,
      title,
    } = productDetails

    return (
      <div className="header-container">
        <div className="product-details-container">
          <div>
            <img src={imageUrl} alt="product" className="details-image" />
          </div>
          <div className="content-container">
            <h1>{title}</h1>
            <p>{`Rs ${price} /-`}</p>
            <div className="review-and-rating-container">
              <div className="rating-card">
                <p className="details-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-details-image"
                />
              </div>
              <p>{`${totalReviews} Reviews`}</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <div className="count-container">
              <button
                type="button"
                onClick={this.onClickDecrease}
                data-testid="plus"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                type="button"
                onClick={this.onClickIncrease}
                data-testid="minus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-cart-btn" type="button">
              Add to cart
            </button>
          </div>
        </div>
        <div>
          <h1>Similar Products</h1>
          <ul className="similar-product-container">
            {similarProducts.map(eachSimilar => (
              <SimilarProductItem
                similarProductsItem={eachSimilar}
                key={eachSimilar.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingDetailsView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">Product Not Found</h1>

      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContent.success:
        return this.renderProductDetailsView()
      case apiStatusContent.inProgress:
        return this.renderLoadingDetailsView()
      case apiStatusContent.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
