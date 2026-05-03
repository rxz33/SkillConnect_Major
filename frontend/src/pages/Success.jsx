import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { BASE_URL } from '../config';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Trigger Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#28a745', '#0d6efd', '#ffc107']
        });

        const confirmHiring = async () => {
            if (sessionId) {
                try {
                    // 1. Get session details
                    const sessionRes = await fetch(`${BASE_URL}/retrieve-session/${sessionId}`);
                    const session = await sessionRes.json();
                    
                    if (session && session.metadata) {
                        // 2. Record hiring
                        await fetch(`${BASE_URL}/record-hiring`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: session.metadata.userId,
                                profileId: session.metadata.profileId,
                                professionalName: session.metadata.professionalName,
                                amount: session.metadata.price,
                                scheduledDate: session.metadata.scheduledDate,
                                scheduledTime: session.metadata.scheduledTime
                            })
                        });
                    }
                } catch (error) {
                }
            }
        };
        confirmHiring();
    }, [sessionId]);

    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
            <FaCheckCircle style={{ fontSize: '80px', color: '#28a745', marginBottom: '20px' }} />
            <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Payment Successful!</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                Thank you for hiring our professional. You can now see them in your "Hired Professionals" list.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link 
                    to="/hired" 
                    style={{ 
                        padding: '12px 30px', 
                        background: '#28a745', 
                        color: 'white', 
                        borderRadius: '5px', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    View Hired List
                </Link>
                <Link 
                    to="/" 
                    style={{ 
                        padding: '12px 30px', 
                        background: '#0d6efd', 
                        color: 'white', 
                        borderRadius: '5px', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Success;
