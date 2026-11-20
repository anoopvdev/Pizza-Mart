
import { FaStar, FaShoppingCart } from "react-icons/fa";

function PizzaCard({ pizza, onAdd }) {

  const imageUrl = pizza.image
  ? pizza.image.startsWith("http")
    ? pizza.image
    : pizza.image.startsWith("/")
      ? pizza.image
      : `/${pizza.image}`
  : "/default-pizza.png";

  const categoryName =
    typeof pizza.category === "object"
      ? pizza.category?.name
      : pizza.category_name;

  const isVeg =
    categoryName?.toLowerCase() === "veg" ||
    categoryName?.toLowerCase() === "vegetarian";

  return (
    <div className="pizza-card">

      <div className="pizza-image-wrap">

        <img
          src={imageUrl}
          alt={pizza.name}
          className="pizza-image"
        />

        <span className="pizza-tag">
          {pizza.tag || (isVeg ? "Veg" : categoryName || "Pizza")}
        </span>

      </div>

      <div className="pizza-info">

        <h6>{pizza.name}</h6>

        <p>{pizza.description}</p>

        {pizza.rating && (
          <div className="rating">
            <FaStar /> {pizza.rating}
            <span>({pizza.reviews || 0})</span>
          </div>
        )}

        <div className="price-row">

          <div>
            <strong>₹{pizza.price}</strong>

            {pizza.oldPrice && (
              <del>₹{pizza.oldPrice}</del>
            )}
          </div>

          <button
            className="btn btn-danger add-button"
            onClick={() => onAdd(pizza)}
          >
            <FaShoppingCart /> Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default PizzaCard;
