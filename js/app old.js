const app = Vue.createApp({
    data() {
        return {
            catalogue: JSON.parse(localStorage.getItem('catalogueData')) || [],
            filteredItems: [],
            pantsItems: [],
            shirtsItems: [],
            cartItems: []

        };
    },
    mounted() {
        if (!this.catalogue.length) {
            // Load initial data if Local Storage is empty
            this.loadInitialData();
        }
        this.populateItems();
        this.loadItemsForPage();

        // Load cart items from localStorage if present
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            this.cartItems = JSON.parse(storedCartItems);
        }
    },
    methods: {
        loadInitialData() {
            // Load your initial catalogue data here and save to Local Storage
            const initialCatalogue = [
                {
                    product_name: "Cool Summer Shirt",
                    gender: "male",
                    type: "shirt",
                    price: "19.99",
                    stock: 10,
                    filepath: "assets/catalogue/male_shirt/male-shirt1.jpg"
                },
                {
                    product_name: "Classic Denim Pants",
                    gender: "male",
                    type: "pant",
                    price: "39.99",
                    stock: 5,
                    filepath: "assets/catalogue/male_pant/male-pants1.jpg"
                },
                {
                    product_name: "Classic Denim Pants2",
                    gender: "male",
                    type: "pant",
                    price: "49.99",
                    stock: 10,
                    filepath: "assets/catalogue/male_pant/male-pants2.jpg"
                },
                {
                    product_name: "Casual Male Shirt",
                    gender: "male",
                    type: "shirt",
                    price: "24.99",
                    stock: 8,
                    filepath: "assets/catalogue/male_shirt/male-shirt2.jpg"
                },
                {
                    product_name: "Formal Male Shirt",
                    gender: "male",
                    type: "shirt",
                    price: "29.99",
                    stock: 6,
                    filepath: "assets/catalogue/male_shirt/male-shirt3.jpg"
                },

                {
                    product_name: "Women's Casual Pants",
                    gender: "female",
                    type: "pant",
                    price: "34.99",
                    stock: 7,
                    filepath: "assets/catalogue/female_pant/female-pants1.jpg"
                },
                {
                    product_name: "Women's Office Pants",
                    gender: "female",
                    type: "pant",
                    price: "36.99",
                    stock: 6,
                    filepath: "assets/catalogue/female_pant/female-pants2.jpg"
                },
                {
                    product_name: "Trendy Female Shirt",
                    gender: "female",
                    type: "shirt",
                    price: "22.99",
                    stock: 8,
                    filepath: "assets/catalogue/female_shirt/female-shirt1.jpg"
                },
                {
                    product_name: "Floral Female Shirt",
                    gender: "female",
                    type: "shirt",
                    price: "26.99",
                    stock: 5,
                    filepath: "assets/catalogue/female_shirt/female-shirt2.jpg"
                }
            ];
            localStorage.setItem('catalogueData', JSON.stringify(initialCatalogue));
            this.catalogue = initialCatalogue;
        },
        populateItems(){
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
