import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        '/api/user/update-password', // ✅ Update with your actual API route
        { oldPassword, newPassword }
      );

      if (data.success) {
        toast.success('Password updated successfully!');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const handleBackdropClick = () => {
    navigate('/'); // ⬅️ Closes modal by navigating home (or anywhere appropriate)
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-none p-4 text-sm text-gray-600"
    >
      <form
        onClick={(e) => e.stopPropagation()} // ⛔ Prevent click bubbling from inside the form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 items-start p-6 sm:p-8 py-10 sm:py-12 w-full max-w-sm rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Update</span> Password
        </p>

        <div className="w-full">
          <p>Old Password</p>
          <input
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            placeholder="Enter old password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        <div className="w-full">
          <p>New Password</p>
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            placeholder="Enter new password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};
export default UpdatePassword;
