const app = Vue.createApp({
    data() {
        return {
            catalogue: [],
            filteredItems: [],
            pantsItems: [],
            shirtsItems: [],
            cartItems: [],
        };
    },
    async mounted() {
        await this.fetchCatalogueData();
        this.populateItems();
        this.checkHealthStatus('/health');
        this.checkHealthStatus('/catalogue');

        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            this.cartItems = JSON.parse(storedCartItems);
        }
    },
    methods: {
        async checkHealthStatus(endpoint) {
            try {
                let url = endpoint;
                // If the endpoint does not start with 'http', prepend the current location's origin
                if (!endpoint.startsWith('http')) {
                    url = `${window.location.origin}${endpoint}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                console.log(`Response from ${endpoint}:`, data);
            } catch (error) {
                console.error(`Error fetching from ${endpoint}:`, error);
            }
        },
        async fetchCatalogueData(retryCount = 3) {
            while (retryCount > 0) {
                try {
                    // Attempt to fetch catalogue data from the backend
                    const response = await fetch('api/catalogue');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    this.catalogue = data.result;
                    console.log('Extracted catalogue data:', this.catalogue);
                    this.populateItems();
                    localStorage.setItem('catalogueData', JSON.stringify(this.catalogue));
                    // Data fetched successfully, break out of the loop
                    return;
                } catch (error) {
                    console.error(`Attempt failed with error: ${error}. Retrying...`);
                    retryCount--;
                    // Wait for a moment before retrying (e.g., 2 seconds)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            // If all retries fail, show an alert or handle it in a user-friendly manner
            alert('Failed to load catalogue data. Please try again later.');
        },
           
        populateItems() {
            this.pantsItems = this.catalogue.filter(item => item.type === 'pant');
            this.shirtsItems = this.catalogue.filter(item => item.type === 'shirt');
        },
        addToCart(item) {
            if (item.stock > 0) {
                const existingItem = this.cartItems.find(cartItem => cartItem.product_name === item.product_name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.cartItems.push({ ...item, quantity: 1 });
                }
                item.stock -= 1; // Decrease the stock in the catalogue
                localStorage.setItem('cartItems', JSON.stringify(this.cartItems)); // Update cart in local storage
                localStorage.setItem('catalogueData', JSON.stringify(this.catalogue)); // Update catalogue in local storage
            } else {
                alert('This item is out of stock.');
            }
        },
        clearCart() {
            this.cartItems.forEach(cartItem => {
                const itemInCatalogue = this.catalogue.find(item => item.product_name === cartItem.product_name);
                if (itemInCatalogue) {
                    itemInCatalogue.stock += cartItem.quantity; // Return the stock to its original value
                }
            });
            this.cartItems = []; // Clear the cart
            localStorage.setItem('cartItems', JSON.stringify(this.cartItems)); // Update both the cart and catalogue in Local Storage
            localStorage.setItem('catalogueData', JSON.stringify(this.catalogue));
        },checkout() {
            // Calculate the total price of items in the cart
            let totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

            // Display the total price and provide options for payment
            const confirmCheckout = confirm(`Total Price: $${totalPrice.toFixed(2)}\nProceed to payment?`);
            if (confirmCheckout) {
                // Decrease stock based on items checked out
                this.cartItems.forEach(cartItem => {
                    const itemInCatalogue = this.catalogue.find(item => item.product_name === cartItem.product_name);
                    if (itemInCatalogue) {
                        itemInCatalogue.stock -= 0; // Decrease stock by the quantity checked out
                    }
                });

                // Prepare order details
                const order_details = this.cartItems.map(cartItem => ({
                    product_name: cartItem.product_name,
                    quantity: cartItem.quantity
                }));
                this.orderSubmitted(user_email = 'sam99yu@yahoo.com.sg', order_details)

                // Clear the cart after successful payment
                this.cartItems = [];
                localStorage.setItem('cartItems', JSON.stringify(this.cartItems)); // Update cart in local storage
                localStorage.setItem('catalogueData', JSON.stringify(this.catalogue)); // Update catalogue in local storage

                alert('Payment successful. Stock updated.');
            } else {
                // Handle cancellation of checkout
                alert('Checkout canceled.');
            }
        }, async orderSubmitted(user_email, order_details){
            // console.log(user_email, order_details)
            const url = 'https://4iwam7mfrk.execute-api.ap-southeast-1.amazonaws.com/default/';
            const headers = {
                'Content-Type': 'application/json',
            };
            const result = order_details.map(item => `Product Name: ${item.product_name}, Quantity: ${item.quantity}\n`).join('');
            console.log(result)
            const body = {
                user_email: user_email,
                order_details: result
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error('Failed to submit order');
                }

                const responseData = await response.json();
                console.log(responseData); // Placeholder for handling the response
            } catch (error) {
                console.error('Error submitting order:', error.message);
            }
        },

    },
    computed: {
        getTotalPrice() {
            return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
        }
    },
}).mount('#app');
