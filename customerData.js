// Dummy customer data
const customerData = [
    {
        customerName: "James Tan",
        customerId: "CUST001",
        orders: [
            { orderId: "ORD001", orderDate: "2025-11-01", items: "Navy Blue Suit, White Dress Shirt, Silk Tie" },
            { orderId: "ORD002", orderDate: "2025-10-15", items: "Grey Wool Blazer, Black Trousers" },
            { orderId: "ORD003", orderDate: "2025-09-20", items: "Linen Shirt, Cotton Chinos" },
            { orderId: "ORD004", orderDate: "2025-08-10", items: "Tuxedo Rental, Bow Tie" },
            { orderId: "ORD005", orderDate: "2025-07-05", items: "Summer Casual Shirt, Shorts" }
        ]
    },
    {
        customerName: "Sarah Lim",
        customerId: "CUST002",
        orders: [
            { orderId: "ORD006", orderDate: "2025-11-05", items: "Custom Wool Coat, Scarf" },
            { orderId: "ORD007", orderDate: "2025-10-22", items: "Business Suit, Dress Shirt" },
            { orderId: "ORD008", orderDate: "2025-09-18", items: "Casual Blazer, Jeans" },
            { orderId: "ORD009", orderDate: "2025-08-25", items: "Polo Shirt, Khaki Pants" },
            { orderId: "ORD010", orderDate: "2025-07-12", items: "Linen Suit, Panama Hat" }
        ]
    },
    {
        customerName: "Michael Wong",
        customerId: "CUST003",
        orders: [
            { orderId: "ORD011", orderDate: "2025-11-08", items: "Charcoal Suit, Leather Belt" },
            { orderId: "ORD012", orderDate: "2025-10-28", items: "Sports Coat, Dress Pants" },
            { orderId: "ORD013", orderDate: "2025-09-14", items: "Oxford Shirt, Navy Blazer" },
            { orderId: "ORD014", orderDate: "2025-08-19", items: "Cotton Polo, Chino Shorts" },
            { orderId: "ORD015", orderDate: "2025-07-20", items: "Linen Shirt, White Trousers" }
        ]
    },
    {
        customerName: "David Chen",
        customerId: "CUST004",
        orders: [
            { orderId: "ORD016", orderDate: "2025-11-12", items: "Three-Piece Suit, Pocket Square" },
            { orderId: "ORD017", orderDate: "2025-10-30", items: "Wool Overcoat, Gloves" },
            { orderId: "ORD018", orderDate: "2025-09-25", items: "Smart Casual Blazer, Loafers" },
            { orderId: "ORD019", orderDate: "2025-08-15", items: "Short Sleeve Shirt, Bermuda Shorts" },
            { orderId: "ORD020", orderDate: "2025-07-08", items: "Vacation Shirt, Linen Pants" }
        ]
    },
    {
        customerName: "Robert Ng",
        customerId: "CUST005",
        orders: [
            { orderId: "ORD021", orderDate: "2025-11-15", items: "Wedding Suit, Cufflinks" },
            { orderId: "ORD022", orderDate: "2025-10-25", items: "Business Casual Shirt, Trousers" },
            { orderId: "ORD023", orderDate: "2025-09-30", items: "Blazer, Dress Shoes" },
            { orderId: "ORD024", orderDate: "2025-08-22", items: "Casual Shirt, Denim Jeans" },
            { orderId: "ORD025", orderDate: "2025-07-18", items: "Beach Shirt, Cotton Shorts" }
        ]
    },
    {
        customerName: "Kevin Lee",
        customerId: "CUST006",
        orders: [
            { orderId: "ORD026", orderDate: "2025-11-18", items: "Double-Breasted Suit, Tie Pin" },
            { orderId: "ORD027", orderDate: "2025-10-20", items: "Cardigan, Dress Shirt" },
            { orderId: "ORD028", orderDate: "2025-09-12", items: "Casual Jacket, T-Shirt" },
            { orderId: "ORD029", orderDate: "2025-08-28", items: "Polo Shirt, Golf Pants" },
            { orderId: "ORD030", orderDate: "2025-07-15", items: "Resort Wear, Sandals" }
        ]
    },
    {
        customerName: "Andrew Koh",
        customerId: "CUST007",
        orders: [
            { orderId: "ORD031", orderDate: "2025-11-20", items: "Pinstripe Suit, Suspenders" },
            { orderId: "ORD032", orderDate: "2025-10-18", items: "Tweed Blazer, Wool Pants" },
            { orderId: "ORD033", orderDate: "2025-09-22", items: "Dress Shirt, Vest" },
            { orderId: "ORD034", orderDate: "2025-08-12", items: "Summer Blazer, Linen Trousers" },
            { orderId: "ORD035", orderDate: "2025-07-25", items: "Casual Shirt, Swim Trunks" }
        ]
    },
    {
        customerName: "Daniel Ong",
        customerId: "CUST008",
        orders: [
            { orderId: "ORD036", orderDate: "2025-11-22", items: "Italian Suit, Silk Pocket Square" },
            { orderId: "ORD037", orderDate: "2025-10-12", items: "Wool Coat, Cashmere Scarf" },
            { orderId: "ORD038", orderDate: "2025-09-28", items: "Business Shirt, Leather Shoes" },
            { orderId: "ORD039", orderDate: "2025-08-08", items: "Casual Wear, Sneakers" },
            { orderId: "ORD040", orderDate: "2025-07-22", items: "Holiday Outfit, Sunglasses" }
        ]
    },
    {
        customerName: "Christopher Teo",
        customerId: "CUST009",
        orders: [
            { orderId: "ORD041", orderDate: "2025-11-23", items: "Formal Suit, Dress Watch" },
            { orderId: "ORD042", orderDate: "2025-10-08", items: "Autumn Jacket, Sweater" },
            { orderId: "ORD043", orderDate: "2025-09-15", items: "Smart Blazer, Chinos" },
            { orderId: "ORD044", orderDate: "2025-08-18", items: "Sports Shirt, Athletic Pants" },
            { orderId: "ORD045", orderDate: "2025-07-10", items: "Beach Wear, Flip Flops" }
        ]
    },
    {
        customerName: "Thomas Goh",
        customerId: "CUST010",
        orders: [
            { orderId: "ORD046", orderDate: "2025-11-24", items: "Executive Suit, Leather Briefcase" },
            { orderId: "ORD047", orderDate: "2025-10-05", items: "Winter Coat, Wool Hat" },
            { orderId: "ORD048", orderDate: "2025-09-10", items: "Office Shirt, Dress Pants" },
            { orderId: "ORD049", orderDate: "2025-08-05", items: "Weekend Wear, Canvas Shoes" },
            { orderId: "ORD050", orderDate: "2025-07-01", items: "Summer Collection, Light Jacket" }
        ]
    }
];

// Function to generate CSV from customer data
function generateCustomerCSV() {
    const csvRows = [];
    csvRows.push('Customer Name,Customer ID,Order ID,Order Date,Items');
    
    // Flatten data and sort by order date
    const flatData = [];
    customerData.forEach(customer => {
        customer.orders.forEach(order => {
            flatData.push({
                customerName: customer.customerName,
                customerId: customer.customerId,
                orderId: order.orderId,
                orderDate: order.orderDate,
                items: order.items
            });
        });
    });
    
    // Sort by order date (descending)
    flatData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    // Add rows
    flatData.forEach(row => {
        csvRows.push(`"${row.customerName}","${row.customerId}","${row.orderId}","${row.orderDate}","${row.items}"`);
    });
    
    return csvRows.join('\n');
}

// Function to download CSV
function downloadCustomerCSV() {
    const csv = generateCustomerCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_orders.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
