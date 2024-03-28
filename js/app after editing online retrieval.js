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
        this.fetchHealthStatus();
        this.fetchHealthStatus2();
        await this.fetchCatalogueData();
        this.populateItems();

        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            this.cartItems = JSON.parse(storedCartItems);
        }
    },
    methods: {
        async fetchHealthStatus() {
            try {
                const response = await fetch('/api/health');
                if (!response.ok) {
                    throw new Error(`Today: Health check failed with status: ${response.status}`);
                }
                const data = await response.json(); // Assuming the response is JSON-formatted
                console.log('Today:Health check response:', data);
            } catch (error) {
                console.error('Today:Health check error:', error);
            }
        },
        async fetchHealthStatus2() {
            try {
                const response = await fetch('/api/health2');
                if (!response.ok) {
                    throw new Error(`Today: Health check 2 failed with status: ${response.status}`);
                }
                const data = await response.json(); // Assuming the response is JSON-formatted
                console.log('Today:Health check 2 response:', data);
            } catch (error) {
                console.error('Today:Health check 2 error:', error);
            }
        },
        async fetchCatalogueData() {
            try {
                const response = await fetch('/api/catalogue');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.catalogue = data; // Adjust based on actual API response structure
                this.populateItems(); // Populate items based on fetched data
                localStorage.setItem('catalogueData', JSON.stringify(this.catalogue));
            } catch (error) {
                console.error('Could not load catalogue data:', error);
            }
        },
        
        async loadCatalogueData() {
            // Make sure to replace '/api/catalogue' with the actual endpoint if needed
            try {
                const response = await fetch('/api/catalogue');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.catalogue = data.result; // Assuming the API response has a 'result' key with the catalogue items
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
