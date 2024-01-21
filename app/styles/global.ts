import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
 /*importante*/ /* o // buga td que vem depois, pq? n sei*/

#__next{
    scroll-behavior: smooth;
}

:root {
    --p-color: #d600ff; /* rosa claro */
    --s-color: #00b8ff; /* azul claro */
    --t-color: #001eff; /* azul escuro */
    --f-color: #bd00ff; /* rosa escuro */
    --fc-color: #20ffff; /* verde claro  */
    
    --card-color: rgb(23, 23, 23);

    --font-p: 'Iceland', cursive;
    --font-s: 'Iceland', cursive;
    --font-t: 'Iceland', cursive;
    
   
}


*:focus {
    outline: transparent !important;
}

a {
    text-decoration: unset !important;
}

body {
   align-items: center;
   background-color: rgb(6, 6, 6);
   color-scheme: dark;
   display: flex;
   height: 100vh;
   justify-content: center;
   margin: 0px;
   padding: 0px;
   color: #fff;
   font-family: var(--font-p);
}
.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5rem;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.2;
    color: inherit;
    font-size: 32px;
}


input, textarea, select, button{
    font-family:var(--font-p)
}

.container {
    max-width: 1200px;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    margin-left: auto;
    margin-right: auto;
   
}

.header-fixed-height {
    height: 115px;
}
`;
