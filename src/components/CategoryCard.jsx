
const CategoryCard = ({ category, onSelect }) => (
  <div
    className="category-card"
    onClick={() => onSelect(category)}
  >
    <span>{category}</span>
  </div>
);

export default CategoryCard;
