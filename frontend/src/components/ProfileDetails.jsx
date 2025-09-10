import {useState,useEffect} from "react";
import React from "react";
const ProfileDetails = () => {
    const [user,setUser]=useState({});
    const [avatar, setAvatar] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(()=>{
      const userData=JSON.parse(localStorage.getItem("user"));
      setUser(userData);
  },[]);
  return (
    <div className="flex-1 p-8 bg-white shadow-md m-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6">MY PROFILE</h2>
       {/* <label htmlFor="avatar-upload" className="cursor-pointer"> */}

      <div className="flex items-center gap-6 mb-6">
        <label htmlFor="avatar-upload" className="cursor-pointer">

          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xl">👤</span>
            )}
          </div>
        </label>

                  <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
  
        <button className="text-blue-600 hover:underline">Change Avatar</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <p className="text-gray-800 font-semibold">{user.username}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Email ID</label>
          <p className="text-green-600 font-semibold">{user.email} ✅</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
          <p className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Add Now
          </p>
          <p className="text-sm text-gray-500">You can use mobile number for an easy login</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
