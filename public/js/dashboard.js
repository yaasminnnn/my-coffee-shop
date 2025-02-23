console.log('Dashboard script starting...');
console.log('LocalStorage contents:', {
    token: localStorage.getItem('token') ? 'Present' : 'Missing',
    userRole: localStorage.getItem('userRole'),
    allKeys: Object.keys(localStorage)
});

const authToken = localStorage.getItem('token');
const userRole = localStorage.getItem('userRole');

// Enhanced role verification
if (!userRole) {
    console.error('No user role found in storage');
    window.location.href = '/login.html';
} else if (userRole !== 'admin') {
    console.error(`Invalid role for dashboard access: ${userRole}`);
    window.location.href = '/';
}

console.log('Initial auth check:', {
    hasToken: Boolean(authToken),
    role: userRole,
    rawRole: localStorage.getItem('userRole')  // Show raw value
});

// Redirect if not authenticated or not admin
if (!authToken || userRole !== 'admin') {
    console.log('Authentication failed:', {
        hasToken: Boolean(authToken),
        role: userRole
    });
    window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded');
    
    const tbody = document.querySelector('#analytics-table tbody');

    // Verify auth again
    if (!authToken || userRole !== 'admin') {
        tbody.innerHTML = '<tr><td colspan="3">Access denied. Please login as admin.</td></tr>';
        return;
    }

    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Fetch analytics data (admin only)
    fetch('/api/analytics/sales', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(res => {
        console.log('Response status:', res.status);
        if (res.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        }
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log('Received data:', data);
        
        // Check if data is an array
        if (!Array.isArray(data)) {
            throw new Error('Expected an array of sales data');
        }

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No sales data available</td></tr>';
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productName || 'Unknown'}</td>
                <td>${item.totalQuantity || 0}</td>
                <td>$${(item.totalSales || 0).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error('Error in dashboard:', err);
        tbody.innerHTML = `<tr><td colspan="3">Error loading data: ${err.message}</td></tr>`;
    });
});
