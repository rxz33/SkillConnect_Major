import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUserTie, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { BASE_URL } from '../config';

const HiredProfessionals = () => {
    const { currentUser } = useContext(AuthContext);
    const [hiredList, setHiredList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHired = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`${BASE_URL}/hired-professionals/${currentUser.uid}`);
                    const data = await response.json();
                    setHiredList(data);
                } catch (error) {
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchHired();
    }, [currentUser]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px 10%', minHeight: '80vh' }}>
            <h1 style={{ marginBottom: '30px', color: '#333' }}>Your Hired Professionals</h1>
            {hiredList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <h3>You haven't hired anyone yet.</h3>
                    <p>Browse our professionals to get started!</p>
                    <Link to="/" style={{ color: '#0d6efd', fontWeight: 'bold' }}>Find Professionals</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {hiredList.map((item) => (
                        <div key={item._id} style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            background: 'white'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ 
                                    background: '#e9ecef', 
                                    padding: '15px', 
                                    borderRadius: '50%', 
                                    marginRight: '15px' 
                                }}>
                                    <FaUserTie style={{ fontSize: '24px', color: '#0d6efd' }} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0 }}>{item.professionalName}</h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Hired Successfully</p>
                                </div>
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                                    <FaCalendarAlt style={{ marginRight: '10px' }} />
                                    <span>{new Date(item.hiredAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                                    <FaDollarSign style={{ marginRight: '10px' }} />
                                    <span>Hiring Fee: ${item.amount}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#28a745', fontWeight: 'bold' }}>
                                    <FaCalendarAlt style={{ marginRight: '10px' }} />
                                    <span>Scheduled: {item.scheduledDate} at {item.scheduledTime}</span>
                                </div>
                            </div>
                            <Link 
                                to={`/propage/${item.profileId}`} 
                                style={{ 
                                    display: 'block', 
                                    textAlign: 'center', 
                                    marginTop: '20px', 
                                    padding: '10px', 
                                    background: '#f8f9fa', 
                                    color: '#0d6efd', 
                                    textDecoration: 'none', 
                                    borderRadius: '6px',
                                    fontWeight: 'bold'
                                }}
                            >
                                View Profile
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HiredProfessionals;
