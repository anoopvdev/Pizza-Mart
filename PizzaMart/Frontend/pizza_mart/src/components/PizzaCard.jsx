import { FaStar, FaShoppingCart } from "react-icons/fa";

function PizzaCard({ pizza, onAdd }) {
  return (
    <div className="pizza-card">
      <div className="pizza-image-wrap">
        <img src={pizza.image} alt={pizza.name} className="pizza-image" />
        <span className="pizza-tag">{pizza.tag}</span>
      </div>

      <div className="pizza-info">
        <h6>{pizza.name}</h6>
        <p>{pizza.description}</p>

        <div className="rating">
          <FaStar /> {pizza.rating}
          <span>({pizza.reviews})</span>
        </div>

        <div className="price-row">
          <div>
            <strong>₹{pizza.price}</strong>
            <del>₹{pizza.oldPrice}</del>
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