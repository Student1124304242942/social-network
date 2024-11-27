import React, { useState } from 'react';

interface EditProfileModalProps {
  profileData: ProfileData;
  onSubmit: (data: ProfileData) => void;
  onClose: () => void;
}

interface ProfileData {
  name: string;
  age: number;
  skills: string[];
  country: string;
  avatar: Blob ;
  profileImage: Blob  ;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profileData, onSubmit, onClose }) => {
  const initialState = {
    name: profileData.name,
    age: profileData.age,
    skills: profileData.skills,
    country: profileData.country,
    avatar: profileData.avatar,
    profileImage: profileData.profileImage,
  };

  const [formData, setFormData] = useState<ProfileData>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ProfileData) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: file || prevData[fieldName], // Retain previous value if no new file is selected
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-80 flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          name="avatar"
          onChange={(e) => handleFileChange(e, 'avatar')}
          className="mb-3"
        />
        <input
          type="file"
          name="profileImage"
          onChange={(e) => handleFileChange(e, 'profileImage')}
          className="mb-3"
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
