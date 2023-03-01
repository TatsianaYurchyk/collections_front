import {createGlobalStyle} from "styled-components"

export interface DefaultTheme {
    body: string;
    textColor: string;
    headingColor: string;
    cardColor: string;
    navbarColor:string;
    modalBody:string;
  }

export const darkTheme = {
    body: "#000",
    textColor: "#fff",
    // headingColor: "lightblue",
    cardColor:" rgba(7, 6, 6, 0.795)",
    navbarColor:"ightblue",
    modalBody:"#000",
  }
  
  export const lightTheme = {
    body: "#fff",
    // body: "rgb(64, 179, 199)",
    textColor: "#000",
    // headingColor: "#d23669",
    cardColor:"#fff",
    navbarColor:"rgb(64, 179, 199)",
    modalBody:"#fff",
  }
  
  export const GlobalStyles = createGlobalStyle <{ theme: DefaultTheme }>`
   body {
    background: ${props => props.theme.body};
    color: ${props => props.theme.textColor};
    transition: .3s ease;
   }
   h2{
     color: ${props => props.theme.headingColor};
   }
   .cardBody{
    background: ${props => props.theme.cardColor};
  }
  .navbar{
    background: ${props => props.theme.navbarColor};
  }
  .modalBody{
    background: ${props => props.theme.modalBody};
  }
 
  
  `