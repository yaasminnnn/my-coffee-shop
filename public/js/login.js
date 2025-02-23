document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page initialized');
    
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            });

            const data = await response.json();
            console.log('Login response data:', data); // Debug log

            if (response.ok) {
                // Clear any existing data
                localStorage.clear();

                // Use optional chaining to support both data.role and data.user.role
                const userRole = data.role || data.user?.role;
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', userRole);

                // Verify storage
                console.log('Stored role:', userRole);

                if (userRole === 'admin') {
                    console.log('Admin login confirmed, redirecting to dashboard...');
                    window.location.href = '/dashboard.html';
                } else {
                    window.location.href = '/';
                }
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login process error:', error);
            errorMessage.textContent = 'Login failed. Please try again.';
            errorMessage.style.display = 'block';
        }
    });
});
