
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://127.0.0.1:8000/api/user/auth/profile/";

const initialProfile = {
  username:"" ,
  email: "",
  phone: "",
  fullName: "",
  gender: "",
  profilePhoto: "",
};
const getToken =()=>{
  return(
    localStorage.getItem("access")|| localStorage.getItem("accessToken")
  )
}

function UserProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewURL, setPreviewURL] = useState("");


  useEffect(() => {
  let active = true;

  const fetchProfile = async () => {
    const token = getToken();
    console.log("Token access",token)
   

    if (!token) {
      if (active) {
        setError("Please log in to view your profile.");
        setLoading(false);
      }
      return;
    }

    try {
      const response = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile Api response ==>",response.data)

      if (!active) return;

      const data = response.data.profile || response.data;

      console.log("Profile API response:", data);

      const loadedProfile = {
        username: data.username ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        fullName: data.first_name ?? data.full_name ?? "",
        gender: data.gender ?? "",
        profilePhoto:
          data.profile_image ??
          data.profile_picture ??
          data.profile_photo ??
          "",
      };
      console.log("Profile informations",loadedProfile)
      setProfile(loadedProfile);
      setSavedProfile(loadedProfile);
      setError("");
    } catch (err) {
      if (!active) return;

      console.error(
        "Profile GET error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : "Failed to load profile. Please try again."
      );
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  fetchProfile();

  return () => {
    active = false;
  };
}, []);

  // Display either the selected file or the saved server image.
  useEffect(() => {
    if (profile?.profilePhoto instanceof File) {
      const objectURL = URL.createObjectURL(profile.profilePhoto);

      setPreviewURL(objectURL);

      return () => URL.revokeObjectURL(objectURL);
    }

    if (profile.profilePhoto) {
      const imageURL = profile.profilePhoto.startsWith("http")
        ? profile.profilePhoto
        : `http://127.0.0.1:8000${
            profile.profilePhoto.startsWith("/")
              ? profile.profilePhoto
              : `/${profile.profilePhoto}`
          }`;

      setPreviewURL(imageURL);
    } else {
      setPreviewURL("");
    }
  }, [profile?.profilePhoto]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setMessage("");

    setProfile((previous) => ({
      ...previous,
      profilePhoto: file,
    }));
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setEditing(false);
    setMessage("");
    setError("");
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !profile.username.trim() ||
      !profile.email.trim() ||
      !profile.phone.trim()
    ) {
      setError("Username, email, and phone are required.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Your session is missing. Please log in again.");
      return;
    }

    const formData = new FormData();

    formData.append("username", profile.username.trim());
    formData.append("first_name", profile.fullName.trim());
    formData.append("email", profile.email.trim());
    formData.append("phone", profile.phone.trim());
    formData.append("gender", profile.gender);

    if (profile.profilePhoto instanceof File) {
      formData.append("profile_image", profile.profilePhoto);
    }

    try {
      setSaving(true);

      const response = await axios.patch(API, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data.profile || response.data;

const updatedProfile = {
  username: result.username ?? profile.username,
  email: result.email ?? profile.email,
  phone: result.phone ?? profile.phone,

  fullName:
    result.first_name ??
    result.full_name ??
    result.fullName ??
    profile.fullName,

  gender: result.gender ?? profile.gender,

  profilePhoto:
    result.profile_picture ??
    result.profile_photo ??
    result.profile_image ??
    profile.profilePhoto,
};

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      // setError(err,"Unable to update profile. Please try again.");
      console.log("Profile update failed",err.response?.data);
      console.log("Status :",err.response?.data)
      const data = err.response?.data;
      setError(typeof data === "object" ? JSON.stringify(data) : data || "Profile update failed")
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading profile....</p>;
  }

  return (
    <div className="profile-page bg-dark">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg profile-navbar">
        <div className="container-fluid px-4">
          <a className="navbar-brand pizza-brand" href="/">
            🍕 Pizza <span>Mart</span>
          </a>

          <div className="d-none d-md-flex gap-4">
            <Link className="text-decoration-none" to="/home">
              Home
            </Link>
            <Link className="text-decoration-none" to="/menu">
              Menu
            </Link>
            <Link className="text-decoration-none" to="/about">
              About
            </Link>
            <Link className="text-decoration-none" to="/contact">
              Contact
            </Link>
          </div>

          <Link
  className="profile-nav-icon"
  to="/profile"
  aria-label="Profile"
>
  <div className="small-avatar">
                  {previewURL ? (
                    <img src={previewURL} alt="Profile" />
                  ) : (
                    <i className="bi bi-person-fill"></i>
                  )}
                </div>

</Link>
        </div>
      </nav>

      <div className="container-fluid px-3 px-lg-4 py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <aside className="col-lg-3">
            <div className="profile-sidebar">
              <div className="sidebar-user">
                <div className="small-avatar">
                  {previewURL ? (
                    <img src={previewURL} alt="Profile" />
                  ) : (
                    <i className="bi bi-person-fill"></i>
                  )}
                </div>

                <div>
                  <h6 className="mb-1">{profile.username}</h6>
                  <small>{profile.email}</small>
                </div>
              </div>

              <div className="sidebar-links">
                <Link className="active" to="/profile">
                  <i className="bi bi-person"></i> My Profile
                </Link>
                <Link to="/orders">
                  <i className="bi bi-box-seam"></i> My Orders
                </Link>
                <Link to="/cart">
                  <i className="bi bi-cart3"></i> My Cart
                </Link>
                <Link to="/addresses">
                  <i className="bi bi-geo-alt"></i> Address Book
                </Link>
                <Link to="/forgotpassword">
                  <i className="bi bi-lock"></i> Change Password
                </Link>
                <Link to="/logout">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </Link>
              </div>
            </div>
          </aside>

          {/* Profile form */}
          <main className="col-lg-9">
            <div className="profile-card">
              <div
                className="d-flex justify-content-between
                           align-items-start flex-wrap gap-3 mb-4"
              >
                <div>
                  <h2 className="profile-heading">User Profile</h2>
                  <p className="text-muted">
                    Update your personal information
                  </p>
                </div>

                {!editing && (
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={handleEdit}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Profile
                  </button>
                )}
              </div>

              {message && (
                <div className="alert alert-success">{message}</div>
              )}

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSave}>
                <div className="row g-4">
                  {/* Profile photo */}
                  <div className="col-md-4 col-xl-3">
                    <div className="photo-section">
                      <div className="profile-photo">
                        {previewURL ? (
                          <img src={previewURL} alt="User profile" />
                        ) : (
                          <i className="bi bi-person-fill"></i>
                        )}
                      </div>

                      {editing && (
                        <label
                          className="btn btn-outline-secondary
                                     photo-button mt-3"
                        >
                          <i className="bi bi-camera me-2"></i>
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePhotoChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Personal details */}
                  <div className="col-md-8 col-xl-9">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Username *
                        </label>
                        <input
                          className="form-control profile-input"
                          name="username"
                          value={profile.username}
                          onChange={handleChange}
                          disabled={!editing}
                          
                          minLength={3}

                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email *</label>
                        <input
                          className="form-control profile-input"
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          disabled={!editing}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone *</label>
                        <input
                          className="form-control profile-input"
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          disabled={!editing}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          className="form-control profile-input"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleChange}
                          disabled={!editing}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select profile-input"
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          disabled={!editing}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="profile-actions mt-4 pt-4">
                    <button
                      className="btn btn-outline-secondary px-4"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-danger px-4"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
