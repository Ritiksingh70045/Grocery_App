import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

function NoSeller() {
  const { axios, searchQuery } = useAppContext();
  const { sellerId } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

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

  // Show helpful message if no seller is selected
  if (!sellerId) {
    return (
      <div className="mt-24 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          No Seller Selected
        </h2>
        <p className="text-gray-600 mt-2 text-base sm:text-lg max-w-md">
          Please choose a seller from the seller list to explore their available products.
        </p>
        <Link
          to="/seller-list"
          className="mt-6 px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm sm:text-base transition"
        >
          Browse Sellers
        </Link>
      </div>
    );
  }

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

export default NoSeller;
