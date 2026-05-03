import React, { useContext, useState, useEffect } from 'react';
import './AccountSettings.css';
import { AuthContext } from '../Context/AuthContext';
import { BASE_URL } from '../config';
import { FaUserAlt, FaLock, FaBell, FaTrashAlt, FaCrown } from 'react-icons/fa';
import { getAuth, updatePassword, deleteUser } from 'firebase/auth';

const AccountSettings = () => {
    const { currentUser } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser) {
                try {
                    const res = await fetch(`${BASE_URL}/myprofile/${currentUser.uid}`);
                    const data = await res.json();
                    if (data && !data.error) {
                        setUserProfile(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch settings data", err);
                }
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!newPassword) return;
        setLoading(true);
        try {
            await updatePassword(auth.currentUser, newPassword);
            alert("Password updated successfully!");
            setNewPassword("");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                // Also delete from MongoDB if you have a cleanup route
                await deleteUser(auth.currentUser);
                window.location.href = "/";
            } catch (error) {
                alert("Please re-login to delete your account for security reasons.");
            }
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-sidebar">
                <h2>Settings</h2>
                <div className="settings-nav">
                    <div className="nav-item active"><FaUserAlt /> Account</div>
                    <div className="nav-item"><FaLock /> Security</div>
                    <div className="nav-item"><FaBell /> Notifications</div>
                </div>
            </div>

            <div className="settings-content">
                <section className="settings-section">
                    <h3>Account Overview</h3>
                    <div className="settings-card">
                        <div className="user-info">
                            <img src={currentUser?.photoURL || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200"} alt="Avatar" />
                            <div>
                                <h4>{currentUser?.displayName || "User"}</h4>
                                <p>{currentUser?.email}</p>
                            </div>
                        </div>
                        
                        <div className="membership-status">
                            <div className="status-label">Membership Plan</div>
                            <div className={`status-badge ${userProfile?.membership === 'Pro' ? 'pro' : 'basic'}`}>
                                {userProfile?.membership === 'Pro' ? <><FaCrown /> Pro Account</> : 'Basic Account'}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Security</h3>
                    <div className="settings-card">
                        <form onSubmit={handlePasswordChange}>
                            <div className="input-group">
                                <label>Change Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter new password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <button className="settings-btn" type="submit" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="settings-section danger">
                    <h3>Danger Zone</h3>
                    <div className="settings-card">
                        <p>Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="settings-btn delete" onClick={handleDeleteAccount}>
                            <FaTrashAlt /> Delete Account
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AccountSettings;
