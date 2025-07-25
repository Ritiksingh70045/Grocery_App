import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, onChange, value }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={onChange}
    value={value}
    required
  />
);

const AddAddress = () => {
  const { axios, user, navigate , selectedSeller} = useAppContext();

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/address/add', { address  , userId : user._id});

      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/cart');
    }
  }, [user, navigate]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="text"
                name="firstName"
                placeholder="First Name"
                value={address.firstName}
                onChange={handleChange}
              />
              <InputField
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={address.lastName}
                onChange={handleChange}
              />
            </div>

            <InputField
              type="email"
              name="email"
              placeholder="Email Address"
              value={address.email}
              onChange={handleChange}
            />

            <InputField
              type="text"
              name="street"
              placeholder="Street"
              value={address.street}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
              />
              <InputField
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="number"
                name="zipcode"
                placeholder="Zip Code"
                value={address.zipcode}
                onChange={handleChange}
              />
              <InputField
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleChange}
              />
            </div>

            <InputField
              type="text"
              name="phone"
              placeholder="Phone"
              value={address.phone}
              onChange={handleChange}
            />

            <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
              Save address
            </button>
          </form>
        </div>

        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
