import { create } from 'zustand';
import axios from '../lib/axios.js';// labar away default export kraya ba harch nawak importi bkain asya
import { toast } from 'react-hot-toast';


const useUserStore = create((set, get) => ({
//states
user: null,
loading: false,

//function
// lera ama ba {} destructure aw obj dakain ka loman det
signup: async ({name, email, password, confirmPassword}) => {
    // hata ba check krdnakan da darwat bbta loading lera set expect e obj dakat dayem
    // set({ key: value }) key = state property value = new value
    set({loading: true});
    
    if(password !== confirmPassword) {
        // lerada bebe returnesh toast kar dakat ballam kare return ragrtni function kaya la esh
        set({loading: false});
        return toast.error("Password do not match!");
    }

    try {
    // labir maka ka dabi lo /auth benre dabi awash dyari kay agar na nazanit
    // tamshay backend bka tedagay
    const res = await axios.post("/auth/signup", {name, email, password});
    console.log(res.data);
    set({user: res.data, loading: false}); // madam data man war grtawa awa lo user e da danayin
    toast.success("User signup successfully");
    } catch (error) {
        set({loading: false});
        toast.error(error.message || "An error occured"); // lerada aw erroray ka la backend warman grtya ama daykaina alert ba toast
    }

},


login: async (email, password) => {
    
    set({loading: true});

    try {
    // check dakain aya aw user w passworda haya w tawawa  w dawat data ka dakainawa?
    const res = await axios.post("/auth/login", {email, password});
    
    // agar habu w tawaw bu awa ama datay userkaman set dakain lo user: 
    set({user: res.data, loading: false});

    
    toast.success("User login successfully");
    } catch (error) {

        set({loading: false});
        toast.error(error.message || "An error occured");
    
    }
}

}));



// understandable example for zustand
// create((set, get) => ({
//   count: 0,

//   increase: () => {
//     set({ count: get().count + 1 });
//   }
// }))

export default useUserStore;