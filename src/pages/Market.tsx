import axios from "axios";
import { useEffect, useState } from "react";
import { APIService } from "../services/api";
import { Product, User } from "src/types";
import ProductGrid from "../components/market/ProductGrid";
import { useHeaderContext } from "../context/HeaderContext";

const Market = () => {
  const { user, switchUser } = useHeaderContext();
  const [desiProducts, setDesiProducts] = useState<Product[]>([]);
  const ApiService = new APIService();

  useEffect(() => {
    switchUser();
    (async () => {
        const products = await ApiService.fetchProducts();
        setDesiProducts(products);
    })();
  }, []);

  return (
    <div className="market-container">
      <h1>{user}'s Market Place</h1>
        <ProductGrid items={desiProducts} />
      </div>
  );
};

export default Market;
