// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const Profile = () => {
//   const [profileData, setProfileData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const fetchProfileData = () => {
//     fetch(`http://localhost:8000/users/profile`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setProfileData(data))
//       .catch((error) => console.error("Error fetching profile:", error));
//   };

//   if (!profileData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="profile-container">
//       <h1>{profileData.username}</h1>
//       <img
//         src={profileData.profile_picture || "default_profile_picture.jpg"} // Replace with actual default
//         alt="Profile"
//         className="profile-picture"
//       />
//       <p>{profileData.bio || "No bio available."}</p>
//       <p>Joined on: {new Date(profileData.date_joined).toLocaleDateString()}</p>
//       <button onClick={() => navigate("/profile/edit")}>Edit Profile</button>
//     </div>
//   );
// };
