import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";


export const useProductStore = create((set, get) => ({
    // productakan lera dabi
    products: [],
    loading: false,

    setProduct: (products) => set({products}),

    createProduct: async (productData) => {
        set({loading: true});

        try {
            const res = await axios.post('/products', productData);
            set((prevState) => ({ 
                products: [...prevState.products, res.data],
                loading: false,
            }));
        } catch (error) {
            set({loading: false});
            toast.error(error.response?.data?.message || error.message);
            console.log(error.message);
        }
    },

    fetchAllProducts: async () => {
        set({loading: true});
        try {
            const res = await axios.get('/products');
            console.log("the product:", res.data);
            set({ products: res.data, loading: false});
        } catch (error) {
            set({ loading: false});
            toast.error(error.response?.data?.message || error.message);
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true});
        try {
            const res = await axios.delete(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }));
            toast.success("Product Deleted");
        } catch (error) {
            set({ loading: false});
            toast.error(error.response?.data?.message || error.message); 
        }
    },


    // la mapaka dast pe dakam 
    // dallen set dakain damanawe data lo array products da bnain parametaraka danusin
    // pashan dallen la state pesh update lanaw proprety products map bka agar har yak
    // la id productakan ka tedaya w aw id ka hatya loman yaksan bu awa ...products ba kaml datay peshu
    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.map((product) => (
                    productId === product._id ? { ...product, isFeatured: res.data.isFeatured  } : product
                )),
                loading: false,
            }))
        } catch (error) {
            set({ loading: false});
            toast.error(error.response?.data?.message || error.message);            
        }
    },

}))
