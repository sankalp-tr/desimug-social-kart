import { Product } from "src/types";

const ProductGrid = ({ items }: { items: Product[] }) => {
  
  return (
  <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Seller</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product: Product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td><img src={product.imageUrl} alt={product.name} width="50" /></td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>{product.seller.name}</td>
            </tr>
          ))}
        </tbody>
      </table>  
      );
    }

export default ProductGrid;