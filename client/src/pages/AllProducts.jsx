import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

function AllProducts() {
  const { axios, searchQuery } = useAppContext();
  const { sellerId } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  
  // Fetch products of a seller
  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const { data } = await axios.get(`/api/user/${sellerId}/products`);
        if (data.success) {
          setAllProducts(data.products);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Error fetching products');
      }
    };

    if (sellerId) fetchSellerProducts();
  }, [sellerId]);

  // Filter based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(allProducts);
    }
  }, [allProducts, searchQuery]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
}

export default AllProducts;
