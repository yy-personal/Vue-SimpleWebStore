const app = Vue.createApp({
    data() {
        return {
            catalogue: [],
            filteredItems: [],
            pantsItems: [],
            shirtsItems: [],
            cartItems: []
        };
    },
    async mounted() {
        await this.loadCatalogueData();
        this.populateItems();

        // Load cart items from localStorage if present
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            this.cartItems = JSON.parse(storedCartItems);
        }
    },
    methods: {
        async loadCatalogueData() {
            // Replace 'YOUR_BACKEND_API_ENDPOINT' with the actual endpoint
            try {
                const response = await fetch('YOUR_BACKEND_API_ENDPOINT/catalogue');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.catalogue = data;
                localStorage.setItem('catalogueData', JSON.stringify(this.catalogue));
            } catch (error) {
                console.error('Could not load catalogue data:', error);
            }
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
