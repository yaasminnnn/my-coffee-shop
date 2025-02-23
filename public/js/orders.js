// Immediate console log to check if script runs at all
console.log('Script loaded at:', window.location.href);

// Check if we're on the correct path
if (!window.location.pathname.includes('/orders.html')) {
    console.warn('Warning: Unexpected path for orders page');
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM Content Loaded Event fired');
    console.log('Page loaded, initializing orders page...');
    
    const loadingEl = document.getElementById("loading");
    const errorEl = document.getElementById("error-message");
    const ordersTbody = document.getElementById("orders-tbody");
    const ordersTable = document.getElementById("orders-table");

    // Back to store button
    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = '/';
    });

    // Check authentication
    const token = localStorage.getItem("token");
    console.log('Auth token status:', token ? 'Present' : 'Missing');
    
    if (!token) {
        errorEl.textContent = "Please login to view your orders";
        errorEl.style.display = "block";
        ordersTable.style.display = "none";
        setTimeout(() => window.location.href = '/', 2000);
        return;
    }

    const isAdmin = localStorage.getItem('userRole') === 'admin';
    
    // Show/hide admin-only columns
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'table-cell' : 'none';
    });

    function getStatusOptions(currentStatus) {
        const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        return statuses.map(status => 
            `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${status}</option>`
        ).join('');
    }

    async function deleteOrder(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete order');
            }
            
            alert('Order deleted successfully');
            // Refresh the orders list
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert(error.message || 'Failed to delete order');
        }
    }

    async function updateOrderStatus(orderId, newStatus) {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update status');
            }
            
            alert('Order status updated successfully');
            // Refresh the orders list
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.message || 'Failed to update order status');
        }
    }

    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch orders');
            
            const orders = await response.json();

            ordersTbody.innerHTML = orders.map(order => `
                <tr>
                    <td>${order._id}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                    ${isAdmin ? `<td>${order.user.username}<br>${order.user.email}</td>` : ''}
                    <td>${order.items.map(item => 
                        `${item.product.name} (x${item.quantity})`
                    ).join('<br>')}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td>
                        ${isAdmin ? 
                            `<select class="status-select" data-order-id="${order._id}">
                                ${getStatusOptions(order.status)}
                            </select>` : 
                            order.status
                        }
                    </td>
                    <td>
                        <button class="delete-btn" data-order-id="${order._id}">Delete</button>
                    </td>
                </tr>
            `).join('');

            // Add event listeners for actions
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (confirm('Are you sure you want to delete this order?')) {
                        deleteOrder(e.target.dataset.orderId);
                    }
                });
            });

            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', (e) => {
                    updateOrderStatus(e.target.dataset.orderId, e.target.value);
                });
            });

        } catch (error) {
            console.error('Error:', error);
            errorEl.textContent = "Error loading orders: " + error.message;
            errorEl.style.display = "block";
        }
    }

    // Initial fetch
    fetchOrders();
});
