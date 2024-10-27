// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const ProfileEdit = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [bio, setBio] = useState("");
//   const [profilePicture, setProfilePicture] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`http://localhost:8000/profile`, {
//       method: "GET",
//       headers: {
//         Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setFirstName(data.first_name);
//         setLastName(data.last_name);
//         setBio(data.bio);
//         // Assuming the profile picture URL is stored in the profilePicture field
//         setProfilePicture(data.profilePicture);
//       });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("first_name", firstName);
//     formData.append("last_name", lastName);
//     formData.append("bio", bio);

//     if (profilePicture) {
//       formData.append("profile_picture", profilePicture);
//     }

//     fetch(`http://localhost:8000/user/update_profile/`, {
//       method: "PUT",
//       body: formData,
//       headers: {
//         Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && data.id) {
//           console.log("Profile updated successfully:", data);
//           navigate("/profile");
//         } else {
//           console.error("Profile update failed:", data);
//         }
//       })
//       .catch((error) => console.error("Error updating profile:", error));
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Edit Profile</h2>
//       <div>
//         <label>First Name</label>
//         <input
//           type="text"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label>Last Name</label>
//         <input
//           type="text"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label>Profile Picture</label>
//         <input
//           type="file"
//           onChange={(e) => setProfilePicture(e.target.files[0])}
//         />
//       </div>
//       <div>
//         <label>About</label>
//         <textarea
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit">Save Changes</button>
//     </form>
//   );
// };
