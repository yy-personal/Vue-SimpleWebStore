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
                // Decrease the stock in the catalogue
                item.stock -= 1;
                localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
                // Update the catalogue in localStorage
                localStorage.setItem('catalogueData', JSON.stringify(this.catalogue));
            } else {
                alert('This item is out of stock.');
            }
        },
        clearCart() {
            // Loop through each item in the cart
            this.cartItems.forEach(cartItem => {
                // Find the corresponding item in the catalogue
                const itemInCatalogue = this.catalogue.find(item => item.product_name === cartItem.product_name);
                if (itemInCatalogue) {
                    // Return the stock to its original value
                    itemInCatalogue.stock += cartItem.quantity;
                }
            });
            // Clear the cart
            this.cartItems = [];
            // Update both the cart and catalogue in Local Storage
            localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
            localStorage.setItem('catalogueData', JSON.stringify(this.catalogue));
        }
        
    }
}).mount('#app');
