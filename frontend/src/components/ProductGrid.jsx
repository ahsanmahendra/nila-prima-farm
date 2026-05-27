import ProductCard from "./ProductCard";

const ProductGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <ProductCard key={item.id} ikan={item} />
      ))}
    </div>
  );
};

export default ProductGrid;