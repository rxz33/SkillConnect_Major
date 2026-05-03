import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { BASE_URL } from '../config';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [isMembership, setIsMembership] = React.useState(false);

    useEffect(() => {
        // Trigger Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2ea6aa', '#f59e0b', '#28a745']
        });

        const confirmHiring = async () => {
            if (sessionId) {
                try {
                    // 1. Get session details
                    const sessionRes = await fetch(`${BASE_URL}/retrieve-session/${sessionId}`);
                    const session = await sessionRes.json();
                    
                    if (session && session.metadata) {
                        // Check if it was a membership purchase
                        if (session.metadata.profileId === 'membership_pro') {
                            setIsMembership(true);
                            // Update membership in DB
                            const updateRes = await fetch(`${BASE_URL}/myprofile/upsert`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    owner: session.metadata.userId,
                                    membership: "Pro"
                                })
                            });
                            const updateData = await updateRes.json();
                            
                            // IF SUCCESSFUL, we need to refresh the Navbar state.
                            // The simplest way is a small delay then reload OR just reload.
                            if (updateData.success) {
                                setTimeout(() => {
                                    // Only reload if we are still on this page to avoid infinite loops
                                    if (window.location.hash.includes('success')) {
                                        window.location.reload(); 
                                    }
                                }, 2000); // Give user 2 seconds to see the success message
                            }
                            return; 
                        }

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
            <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
                {isMembership ? 'Welcome to SkillConnect Pro!' : 'Payment Successful!'}
            </h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
                {isMembership 
                    ? 'Your account has been upgraded to Pro. You now have access to exclusive benefits, unlimited chats, and the priority badge!' 
                    : 'Thank you for hiring our professional. You can now see them in your "Hired Professionals" list.'
                }
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link 
                    to={isMembership ? "/profile" : "/hired"} 
                    style={{ 
                        padding: '12px 30px', 
                        background: '#2ea6aa', 
                        color: 'white', 
                        borderRadius: '12px', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    {isMembership ? 'View Your Profile' : 'View Hired List'}
                </Link>
                <Link 
                    to="/" 
                    style={{ 
                        padding: '12px 30px', 
                        background: '#f1f5f9', 
                        color: '#475569', 
                        borderRadius: '12px', 
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
