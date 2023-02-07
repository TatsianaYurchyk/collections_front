import { createContext, ReactNode,useContext, useState } from "react";
import { User } from "../models/user";
import { useLocalStorage } from "../hooks/useLocalStorage";


interface LoginProviderProps {
    children:ReactNode
}

// interface CartItem {
//     id: number
//     quantity:number
// }

interface LoginContext {
    // openCart: ()=> void
    // closeCart: () => void
    // getItemQuantity:(id:number) => number
    // increaseItemQuantity:(id:number) => void
    // decreaseItemQuantity:(id:number) => void
    // removeFromCart:(id:number) => void
    // cartQuantity: number
    userItems: User[]
}

const LoginContext = createContext({} as LoginContext)

export function useLogin () {
    return useContext (LoginContext)
}

export function LoginProvider ({children}: LoginProviderProps){
    const [userItems,setUserItems]= useLocalStorage<User[]>('loggedInUser',[])
    const [isOpen,setIsOpen]=useState (false)

    // const cartQuantity =cartItems.reduce(
    //     (quantity,item) => item.quantity+quantity,0
    // )
    
    // const openCart = () => setIsOpen (true)    
    // const closeCart = () => setIsOpen (false)    

    // function getItemQuantity (id:number){
    //     return cartItems.find(item=>item.id === id)?.quantity || 0
    // }

    // function increaseItemQuantity (id:number) {
    //     setCartItems (currItems =>{
    //         if (currItems.find (item=> item.id ===id) ==null) {
    //             return [...currItems,{id,quantity:1}]
    //         } else {
    //             return currItems.map ( item => {
    //                 if (item.id ===id ){
    //                     return {...item,quantity:item.quantity +1}
    //                 } else {return item}
    //             }
    //             )
    //         }
    //     })
    // }

    // function decreaseItemQuantity (id:number) {
    //     setCartItems (currItems =>{
    //         if (currItems.find (item=> item.id ===id)?.quantity ===1) {
    //             return currItems.filter(item=>item.id !== id)
    //         } else {
    //             return currItems.map ( item => {
    //                 if (item.id ===id ){
    //                     return {...item,quantity:item.quantity -1}
    //                 } else {return item}
    //             }
    //             )
    //         }
    //     })
    // }

    // function removeFromCart (id:number) {
    //     setCartItems(currItems => {
    //         return currItems.filter (item => item.id !==id)
    //     })
    // }



    return (
        <LoginContext.Provider value={{
            // getItemQuantity,
            // increaseItemQuantity,
            // decreaseItemQuantity,
            // removeFromCart,
            userItems,
            // cartQuantity,
            // openCart,
            // closeCart
            }}>
        {children}
        {/* <ShoppingCart isOpen={isOpen}/> */}
        </LoginContext.Provider>
    )
}