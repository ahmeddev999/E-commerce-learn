import { create } from 'zustand';
import axios from '../lib/axios';// labar away default export kraya ba harch nawak importi bkain asya
import { toast } from 'react-hot-toast';


const useUserStore = create((set, get) => ({
//states
user: null,
loading: false,

//function
// lera ama ba {} destructure aw obj dakain ka loman det
signup: async({name, email, password, confirmPassword}) => {
    // hata ba check krdnakan da darwat bbta loading lera set expect e obj dakat dayem
    // set({ key: value }) key = state property value = new value
    set({loading: true});
    
    if(password !== confirmPassword) {
        // lerada bebe return esh toast kar dakat ballam kare return ragrtni function kaya la kar krdn
        set({loading: false});
        return toast.error("Password do not match!");
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