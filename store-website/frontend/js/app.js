function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const app = Vue.createApp({
    data() {
        return {
            catalogue: JSON.parse(localStorage.getItem('catalogueData')) || [],
            randomCatalogueItems: [],
            randomShirts: [],
            randomPantsItems: []
        };
    },
    mounted() {
        if (!this.catalogue.length) {
            // Load initial data if Local Storage is empty
            this.loadInitialData();
        }
        this.populateRandomItems();
    },
    methods: {
        loadInitialData() {
            // Load your initial catalogue data here and save to Local Storage
            const initialCatalogue = [
                // Existing items
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
                // Additional items based on your files
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
                    product_name: "Stylish Female Dress",
                    gender: "female",
                    type: "dress",
                    price: "45.99",
                    stock: 4,
                    filepath: "assets/catalogue/female_dress/female-dress1.jpg"
                },
                {
                    product_name: "Elegant Evening Dress",
                    gender: "female",
                    type: "dress",
                    price: "49.99",
                    stock: 3,
                    filepath: "assets/catalogue/female_dress/female-dress2.jpg"
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
        populateRandomItems() {
            // Your existing method to shuffle and select items
            let shuffledCatalogue = shuffle([...this.catalogue]);
            this.randomCatalogueItems = shuffledCatalogue.slice(0, 3);
            this.randomShirts = shuffledCatalogue.filter(item => item.type === 'shirt').slice(0, 3);
            this.randomPantsItems = shuffledCatalogue.filter(item => item.type === 'pant').slice(0, 3);
        }
    }
}).mount('#app');
