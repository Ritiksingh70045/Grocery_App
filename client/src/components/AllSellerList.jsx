import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AllSellerList = () => {
  const { axios, setSelectedSeller, navigate } = useAppContext();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data } = await axios.get('/api/user/seller-list');
        if (data.success) {
          setSellers(data.sellers);
          setFilteredSellers(data.sellers);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Failed to fetch sellers');
      }
    };
    fetchSellers();
  }, []);

  useEffect(() => {
    const filtered = sellers.filter((seller) =>
      seller.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSellers(filtered);
  }, [searchQuery, sellers]);

  const handleClick = (seller) => {
    setSelectedSeller(seller);
    navigate(`/user/${seller._id}/products`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Sellers</h2>

      <input
        type="text"
        placeholder="Search by address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full block mx-auto mb-8 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="space-y-4">
        {filteredSellers.map((seller) => (
          <div
            key={seller._id}
            onClick={() => handleClick(seller)}
            className="cursor-pointer p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 hover:-translate-y-1"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
              🛍️ {seller.sellerName}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">{seller.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSellerList;
