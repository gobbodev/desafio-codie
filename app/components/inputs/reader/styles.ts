import styled from "styled-components";

export const Reader = styled.div`
  height: 100vh;
  .fake-header {
    display: flex;
    justify-content: center;
    align-items: center;

    color: #fff;
    height: 75px;
    margin-bottom: 25px;
    margin-top: 25px;
    padding: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    h1 {
      margin: 0;
    }
    input {
      margin-top: 4px;
      margin-left: 15px;
      padding-left: 5px;
      font-size:16px;
      width:200px;
    }
  }

  .folder {
    width: fit-content;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    h2 {
      margin: 0;
      height: fit-content;
      border-bottom: 1px solid rgba(255, 255, 255, 0.9);
    }
    h6 {
      margin: 0;
    }
  }
  .cards {
    /*display: grid;
    grid-template-columns: repeat(3, 1fr);*/
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 12px;
    position: relative;
    border-radius: 12px;
    max-width: 984px;
    width: 100%;
    padding-bottom: 25px;

    &:hover .card::after {
      opacity: 1;
    }
    .card {
      background-color: rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      display: flex;
      height: 260px;
      flex-direction: column;
      position: relative;
      width: 320px;
      word-break: break-all;
      &:hover::before {
        opacity: 1;
      }
      &::before,
      ::after {
        border-radius: inherit;
        content: "";
        height: 100%;
        left: 0px;
        opacity: 0;
        position: absolute;
        top: 0px;
        transition: opacity 500ms;
        width: 100%;
      }
      &::before {
        background: radial-gradient(
          600px circle at var(--mouse-x) var(--mouse-y),
          rgba(255, 255, 255, 0.06),
          transparent 50%
        );
        pointer-events: none; /**/
        z-index: 3;
      }
      &::after {
        background: radial-gradient(
          500px circle at var(--mouse-x) var(--mouse-y),
          rgba(255, 255, 255, 0.9),
          transparent 50%
        );
        z-index: 1;
      }
      .card-content {
        background-color: var(--card-color);
        border-radius: inherit;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        inset: 1px;
        padding: 20px;
        position: absolute;
        z-index: 2;
        h2 {
          margin: 0;
          color: #434343;
          margin-bottom: 25px;
          font-size: 38px;
        }
        .edit-container {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          svg {
            cursor: pointer;
            transition: 0.3s all linear;
            &:hover {
              fill: rgb(255, 255, 255);
            }
          }
          .dot-container {
            display: flex;
            position: relative;
            .dot-menu {
              position: absolute;
              display: flex;
              align-items: flex-start;
              gap: 15px;
              visibility: hidden;
              height: fit-content;
              width: 160px;
              padding: 15px 0;
              margin-left: 20px;
              opacity: 0;
              background-color: #434343;
              border-radius: 12px;
              border: 1px solid rgb(255, 255, 255);
              transition: 0.3s ease-in all;
              flex-direction: column;
              z-index: 51;
              #item-move {
                cursor: default !important;
                &:hover {
                  .move-menu {
                    visibility: visible;
                    opacity: 1;
                  }
                }
              }
              .item {
                position: relative;
                padding-left: 12px;
                .row-sub-items {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  gap: 8px;
                }
                h6 {
                  border-bottom: 1px solid transparent;
                  font-size: 18px;
                  margin: 0;
                  transition: 0.3s linear all;
                }
                cursor: pointer;
                &:hover {
                  h6 {
                    border-bottom-color: rgb(255, 255, 255);
                  }
                }
                .move-container {
                  display: flex;
                  flex-direction: row;
                  position: relative;
                  .width-container {
                    width: fit-content;
                    .move-menu {
                      position: absolute;
                      display: flex;
                      flex-direction: column;
                      margin-left: 20px;
                      margin-top: -30px;
                      padding: 8px 0;
                      gap: 8px;
                      width: 100%;
                      background-color: #434343;
                      border-radius: 12px;
                      border: 1px solid rgb(255, 255, 255);
                      transition: 0.3s ease-in all;
                      visibility: hidden;
                      opacity: 0;
                      label {
                        width: fit-content;
                        margin: 0;
                        margin-left: 12px;
                        border-bottom: 1px solid transparent;
                        transition: 0.3s linear all;
                        margin-right: 12px;
                        cursor: pointer;
                        &:hover {
                          border-bottom: 1px solid rgb(255, 255, 255);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .values-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          h3 {
            display: flex;
            color: #c2c0c0;
            font-size: 18px;
            margin: 0;
            word-break: normal;
            span {
              word-break: break-all;
              margin: 0 5px;
            }
            svg {
              cursor: pointer;
              path {
                transition: 0.3s all linear;
              }
              &:hover {
                path {
                  stroke: rgb(255, 255, 255);
                }
              }
            }
          }
        }
        .link-button {
          button {
            cursor: pointer;
            background-color: #1f1e1e;
            z-index: 4;
            height: 50px;
            width: 278px;
            margin-top: 25px;
            font-size: 18px;
            color: #c2c0c0;
          }
        }
      }
    }
  }
  .add {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 999; /* ajuste a ordem de empilhamento conforme necessário */
    .plus-container {
      position: relative;
      margin-bottom: 30px;
      margin-right: 60px;
      padding: 0;
      svg {
        visibility: visible;
        opacity: 1;
        transition: 0.3s linear all;
        cursor: pointer;
        &:hover {
          fill: #c2c0c0;
        }
      }
    }
  }
  .add-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    visibility: hidden;
    opacity: 0;
    transition: 0.3s linear all;
    .menu-background {
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .menu-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 600px;
      width: 100%;
      height: 500px;
      background-color: var(--card-color);
      border-radius: 12px;
      padding: 20px 60px;
      z-index: 3;
      svg {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 10px;
        margin-top: 10px;
        cursor: pointer;
        transition: 0.3s linear all;
        &:hover {
          fill: #c2c0c0;
        }
      }
      input {
        width: 100%;
        font-size: 16px;
        padding-left: 5px;
      }
      .top-container {
        display: flex;
        justify-content: center;
        width: 100%;
      }
      .mid-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        input {
          width: 250px;
        }
      }
      .bottom-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .sub-item {
          input {
            width: 225px;
          }
          .pass-container {
            position: relative;
            display: flex;
            flex-direction: row;
            svg {
              position: absolute;
              left: 0;
              margin-left: -30px;
              margin-top: 0;
              fill:none;
              path {
                transition: 0.3s all linear;
              }
              cursor: pointer;
              &:hover{
                path {
                  stroke:#c2c0c0;
              }
              }
            }
          }
        }
      }
      .submit-container {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 50px;
        button {
          position: relative;
          cursor: pointer;
          background-color: #1f1e1e;
          z-index: 4;
          height: 50px;
          width: 278px;
          font-size: 18px;
          color: #c2c0c0;
        }
      }
    }
  }
`;
