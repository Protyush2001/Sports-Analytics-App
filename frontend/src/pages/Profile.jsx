import ProfileSidebar from "../components/ProfileSidebar";
import ProfileDetails from "../components/ProfileDetails";

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />
      <ProfileDetails />
    </div>
  );
};

export default Profile;