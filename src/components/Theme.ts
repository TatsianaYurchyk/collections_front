import {createGlobalStyle} from "styled-components"

export interface DefaultTheme {
    body: string;
    textColor: string;
    headingColor: string;
    cardColor: string;
    navbarColor:string;
    modalBody:string;
    tableBackground:string;
    tableColor:string;
    borderColor:string;
    buttonColor:string;
    btnClose:string;
  }

export const darkTheme = {
    body: "#000",
    textColor: "#fff",
    cardColor:"#000 ",
    navbarColor:"#000 ",
    modalBody:"#000",
    tableBackground:"#000",
    tableColor:"#fff",
    borderColor:"#fff",
    buttonColor:"#000",
    btnClose:"#fff",
  }
  
  export const lightTheme = {
    body: "#fff",
    textColor: "#000",
    cardColor:"#fff",
    navbarColor:"rgb(64, 179, 199)",
    modalBody:"#fff",
    tableBackground:"#fff",
    tableColor:"#000",
    borderColor:"text-muted",
  }
  
  export const GlobalStyles = createGlobalStyle <{ theme: DefaultTheme }>`
   body {
    background: ${props => props.theme.body};
    color: ${props => props.theme.textColor};
    transition: .3s ease;
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
  .buttonColor{
    background: ${props => props.theme.buttonColor};
  }
  .btn-close{
    background-color: ${props => props.theme.btnClose};
  }

  .MuiDataGrid-root.MuiDataGrid-root--densityStandard.css-18ermex-MuiDataGrid-root{
    background: ${props => props.theme.tableBackground};
    color: ${props => props.theme.tableColor};
  }
  .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-i4bv87-MuiSvgIcon-root{
    color: ${props => props.theme.borderColor};
  }
 
  
  `