import React, { useState, useEffect } from "react";
import "./MyProfile.css";

const maskEmail = (email) => {
  if (!email) return "";
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}************@${domain}`;
};

const MyProfile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/users/profile", {
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User data:", data);
        setProfile(data);
      });
  }, []);

  const handleSave = async () => {
    const updatedProfile = { ...profile };
    if (!updatedProfile.password) {
      delete updatedProfile.password; // Không gửi password nếu không thay đổi
    }

    console.log("Updating profile with:", updatedProfile);

    const res = await fetch("http://localhost:4000/api/users/changeProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(updatedProfile),
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile updated successfully!");
    } else {
      alert(data.error || "Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      <label className="profile-label">Name</label>
      <input
        type="text"
        className="profile-input"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />

      <label className="profile-label">Email</label>
      <div className="profile-flex">
        <input
          disabled={!editEmail}
          type="text"
          className={`profile-input ${!editEmail ? "readonly" : ""}`}
          value={editEmail ? profile.email : maskEmail(profile.email)}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <button className="profile-change-btn" onClick={() => setEditEmail(true)}>Change</button>
      </div>

      <label className="profile-label">Password</label>
      <div className="profile-flex">
        <input
          disabled={!editPassword}
          type="password"
          className={`profile-input ${!editPassword ? "readonly" : ""}`}
          value={editPassword ? profile.password : "********"}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
        />
        <button className="profile-change-btn" onClick={() => setEditPassword(true)}>Change</button>
      </div>

      <button className="profile-save-btn" onClick={handleSave}>Save</button>
    </div>
  );
};

export default MyProfile;
