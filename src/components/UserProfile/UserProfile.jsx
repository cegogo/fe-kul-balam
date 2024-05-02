// UserProfile.js
import React, { useState, useEffect } from 'react';
import Timeline from './Timeline';
import FriendsList from './FriendsList';
import EditProfileModal from './EditProfileModal';
import './UserProfile.css';
import UserInfo from './UserInfo';

const BASE_URL = 'http://localhost:8000';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem("user_id");
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(BASE_URL + '/groups/all');
      if (response.ok) {
        const groupsData = await response.json();
        console.log('Groups:', groupsData);
        setGroups(groupsData);
      } else {
        throw new Error('Failed to fetch groups');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch groups');
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}/friends`);
        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }
        const data = await response.json();
        const friendPromises = data.map(async (f) => {
          const response = await fetch(`http://localhost:8000/users/${f.friend_id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch friend ${f.friend_id}`);
          }
          return response.json();
        });
        const friendsData = await Promise.all(friendPromises);
        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends:', error.message);
      }
    };

    if (userId) {
      fetchFriends();
      fetchGroups(); // Call fetchGroups here
    }
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedUser) => {
    // Logic to save updated user data
    console.log('Updated user:', updatedUser);
    setIsEditing(false);
    // Assume there's a function to update user data in the parent component
    // updateUser(updatedUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUnfriend = async (friendId) => {
    try {
      const response = await fetch(`http://localhost:8000/friends/${friendId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the unfriended friend from the list
        const updatedFriends = friends.filter((friend) => friend.id !== friendId);
        setFriends(updatedFriends);
        console.log(`Unfriended user with ID: ${friendId}`);
      } else {
        throw new Error('Failed to unfriend user');
      }
    } catch (error) {
      console.error('Error unfriending user:', error.message);
      alert('Failed to unfriend user');
    }
  };
  

  return (
    <div className="user-profile">
      <div className="profile-body">
        <div className="left-column">
          <button className='edit-profile' onClick={handleEdit}>Edit Profile</button>
          <UserInfo user={user} /> {/* Render UserInfo component here */}
          {friends.length > 0 && <FriendsList friends={friends} onUnfriend={handleUnfriend}/>}
        </div>
          <Timeline/>
      </div>
      {/* Edit Profile Modal */}
      {isEditing && (
        <EditProfileModal
          user={user}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UserProfile;
