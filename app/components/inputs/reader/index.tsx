import React, { useState, useEffect, useRef, useContext } from "react";

import MyContext from "@/components/context/todo";

import NextLink from "next/link";

import api from "@/api";
import * as S from "./styles";
import * as Yup from "yup";

interface Item {
  folder: string;
  id: number;
  title: string;
  url: string;
  user: string;
  password: string;
}

export default function Reader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [folders, setFolders] = useState<string[]>([]);

  const [addMenu, setAddMenu] = useState(false);
  const [editMenu, setEditMenu] = useState(false);
  const [dotMenu, setDotMenu] = useState({ isTrue: false, id: -1 });

  const [urlInput, setUrlInput] = useState("");
  const [folderInput, setFolderInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [tempId, setTempId] = useState(-1);

  const [error, setError] = useState<string[]>([]);

  const [showPass, setShowPass] = useContext(MyContext);
  const [addShowPass, setAddShowPass] = useState(false);

  const results = !searchTerm
    ? items
    : items.filter(
        (person) =>
          person.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.folder.toLowerCase().includes(searchTerm.toLowerCase())
        /*filter é uma função de array que retorna um novo array com todos os elementos que atendem a uma determinada condição*/
        /* converte a lista para lowercase e o termo de pesquisa também e verifica se o termo existe dentro da lista */
      );

  const retrieveItems = async () => {
    const response = await api.get("/storage");
    return response.data;
  };

  const addItems = async (isClone: boolean, item?: any) => {
    const newItem =
      isClone === false
        ? {
            url: urlInput,
            folder: folderInput,
            title: titleInput,
            user: userInput,
            password: passwordInput,
          }
        : {
            url: item.url,
            folder: item.folder,
            title: item.title,
            user: item.user,
            password: item.password,
          };

    try {
      const schema = Yup.object().shape({
        url: Yup.string().url().required("Por favor informe o link."),
        folder: Yup.string().required("Por favor informe a pasta."),
        title: Yup.string().required("Por favor informe o título."),
        user: Yup.string().required("Por favor informe seu user."),
        password: Yup.string().required("Por favor informe sua senha."),
      });

      await schema
        .validate(newItem, {
          abortEarly: false,
        })
        .catch((erro) => {
          setError(erro.errors);
          throw new Error();
        });

      const response = await api.post("/storage", newItem);
      setItems([...items, response.data]);
      if (!folders.includes(response.data.folder)) {
        setFolders([...folders, response.data.folder]);
      }
      isClone === false ? setAddMenu(false) : null;
    } catch (erro) {
      console.log(erro);
    }
  };

  const removeItems = async (id: number, folderI: string) => {
    // Remove um item do banco de dados via API
    // e remove o item da lista de items da aplicação.
    /*await api.delete(`/storage/${id}`).then(() => {
      setItems(items.filter((item) => item.id !== id));
    });*/
    await api.delete(`/storage/${id}`);
    setItems(items.filter((item) => item.id !== id));

    if (countFoldersItems(folderI) === 0) {
      setFolders(folders.filter((folderData) => folderData !== folderI));
    }
  };

  const editClick = (item: any) => {
    setTempId(item.id);
    setUrlInput(item.url);
    setFolderInput(item.folder);
    setTitleInput(item.title);
    setUserInput(item.user);
    setPasswordInput(item.password);
  };

  const editItems = async (isMoving: boolean, item?: any, folderI?: string) => {
    const updatedItem =
      isMoving === false
        ? {
            id: tempId,
            url: urlInput,
            folder: folderInput,
            title: titleInput,
            user: userInput,
            password: passwordInput,
          }
        : {
            id: item.id,
            url: item.url,
            folder: folderI,
            title: item.title,
            user: item.user,
            password: item.password,
          };

    try {
      const schema = Yup.object().shape({
        url: Yup.string().url().required("Por favor informe o link."),
        folder: Yup.string().required("Por favor informe a pasta."),
        title: Yup.string().required("Por favor informe o título."),
        user: Yup.string().required("Por favor informe seu user."),
        password: Yup.string().required("Por favor informe sua senha."),
      });

      await schema
        .validate(updatedItem, {
          abortEarly: false,
        })
        .catch((erro) => {
          setError(erro.errors);
          throw new Error();
        });
      const response = await api.put(`/storage/${updatedItem.id}`, updatedItem);
      setItems(
        items.map((item) =>
          item.id === response.data.id ? response.data : item
        )
      );

      if (!folders.includes(response.data.folder)) {
        setFolders([...folders, response.data.folder]);
      }
      setEditMenu(false);
    } catch (erro) {
      console.log(erro);
    }
  };

  const cloneItems = async (item: any) => {
    addItems(true, item);
  };

  const copySubItems = (subItem: any) => {
    navigator.clipboard.writeText(subItem);
  };

  const countFoldersItems = (folder: string): number => {
    let count = 0;
    for (const item of items) {
      if (item.folder === folder) {
        count++;
      }
    }
    return count;
    //const uniqueFolders = new Set(items.map((item) => item.folder));
    //return uniqueFolders.size;
  };

  const searchOnChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const urlOnChange = (e: any) => {
    setUrlInput(e.target.value);
  };

  const folderOnChange = (e: any) => {
    setFolderInput(e.target.value);
  };

  const titleOnChange = (e: any) => {
    setTitleInput(e.target.value);
  };

  const userOnChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const passwordOnChange = (e: any) => {
    setPasswordInput(e.target.value);
  };

  useEffect(() => {
    const getAllItems = async () => {
      const allItems = await retrieveItems();
      if (allItems) {
        setItems(allItems);

        // Extrai pastas únicas dos itens
        const uniqueFolders = allItems.reduce((folders: any, item: any) => {
          if (!folders.includes(item.folder)) {
            return [...folders, item.folder];
          }
          return folders;
        }, [] as string[]);

        setFolders(uniqueFolders);
      } else {
        setItems([]);
      }
    };

    getAllItems();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      const cardsDoc = document.getElementsByClassName("cards");
      if (cardsDoc) {
        for (const cardDoc of Array.from(cardsDoc)) {
          (cardDoc as HTMLElement).onmousemove = (e) => {
            for (const card of Array.from(
              document.getElementsByClassName("card")
            )) {
              const rect = card.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

              (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
              (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
            }
          };
        }
      }
    };
    addEventListener("mousemove", handleMouseMove);
    return () => {
      removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <S.Reader>
      <div className="fake-header">
        <h1>Gabriel Gerenciador de Senhas</h1>
        <input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={searchOnChange}
        />
      </div>

      {folders.map((folder) => {
        return (
          <>
            <div
              className="folder"
              style={
                !folder || countFoldersItems(folder) === 0
                  ? { display: "none" }
                  : undefined
              }
            >
              <h2>{folder}</h2>
              <h6>&#40;{countFoldersItems(folder)}&#41;</h6>
            </div>
            <div className="cards">
              {results.length != 0 ? (
                results.map((item) => {
                  if (item.folder === folder)
                    return (
                      <div className="card">
                        <div className="card-content">
                          <div className="edit-container">
                            <div>
                              <svg
                                className="wrench"
                                width="20px"
                                height="20px"
                                viewBox="0 -0.5 17 17"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#434343"
                                onClick={() => {
                                  editClick(item);
                                  setEditMenu(true);
                                }}
                              >
                                <path d="M7.98223907,11.1892589 L12.1593128,7.00532298 C13.438051,7.47227549 14.9275022,7.20204355 15.9542112,6.17288437 C16.652456,5.47193792 16.9809202,4.6394993 17.0377301,3.66728555 L16.3611763,4.36098439 L14.1486907,5.10023958 L11.8804281,2.84416527 L12.6561408,0.669885304 L13.32753,0 C12.3824206,0.077652856 11.5292399,0.35927388 10.8413242,1.04779587 C9.8239113,2.06867208 9.55019109,3.54304098 10.0005383,4.81965393 L5.85238593,8.97770553 C4.5860426,8.5221421 3.11518379,8.86070856 2.08744185,9.89193848 C0.675458712,11.3072912 0.700248467,13.5799315 2.08744185,14.9704353 C3.47360233,16.3609391 5.74083203,16.3402316 7.15281517,14.9248789 C8.15473445,13.921604 8.38403968,12.4337753 7.98223907,11.1892589 L7.98223907,11.1892589 Z M2.73293107,14.2904887 C1.75568964,13.314463 1.75568964,11.731045 2.73293107,10.7550193 C3.70886076,9.77899358 5.29212304,9.77899358 6.26805273,10.7550193 C7.24398242,11.731045 7.24398242,13.314463 6.26805273,14.2904887 C5.29212304,15.2678263 3.70754903,15.2665144 2.73293107,14.2904887 L2.73293107,14.2904887 Z"></path>
                              </svg>
                            </div>
                            <div className="dot-container">
                              <svg
                                className="3dots"
                                width="20px"
                                height="20px"
                                viewBox="0 0 24 24"
                                fill="#434343"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() =>
                                  setDotMenu({
                                    isTrue: !dotMenu.isTrue,
                                    id: item.id,
                                  })
                                }
                              >
                                <path d="M14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5Z" />
                                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" />
                                <path d="M12 21C13.1046 21 14 20.1046 14 19C14 17.8954 13.1046 17 12 17C10.8954 17 10 17.8954 10 19C10 20.1046 10.8954 21 12 21Z" />
                              </svg>
                              <div
                                className="dot-menu"
                                style={
                                  dotMenu.isTrue && dotMenu.id === item.id
                                    ? { visibility: "visible", opacity: 1 }
                                    : undefined
                                }
                              >
                                <div
                                  className="item"
                                  onClick={() => {
                                    removeItems(item.id, folder);
                                    setDotMenu({ isTrue: false, id: -1 });
                                  }}
                                >
                                  <div className="row-sub-items">
                                    <svg
                                      width="20px"
                                      height="20px"
                                      viewBox="0 0 24 24"
                                      version="1.1"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g>
                                        <g fill="#fff">
                                          <path d="M15.8698693,2.66881311 L20.838395,7.63733874 C21.7170746,8.5160184 21.7170746,9.9406396 20.838395,10.8193193 L12.1565953,19.4998034 L18.25448,19.5 C18.6341758,19.5 18.947971,19.7821539 18.9976334,20.1482294 L19.00448,20.25 C19.00448,20.6296958 18.7223262,20.943491 18.3562506,20.9931534 L18.25448,21 L9.84446231,21.0012505 C9.22825282,21.0348734 8.60085192,20.8163243 8.13013068,20.345603 L3.16160505,15.3770774 C2.28292539,14.4983977 2.28292539,13.0737765 3.16160505,12.1950969 L12.6878888,2.66881311 C13.5665685,1.79013346 14.9911897,1.79013346 15.8698693,2.66881311 Z M11.6976366,17.7582967 L5.7429273,11.8035875 L4.23660183,13.2700937 C3.94370861,13.5629869 3.94370861,14.0378606 4.23660183,14.3307538 L9.1823612,19.2763813 C9.47983601,19.5646202 9.95465072,19.5571329 10.2428895,19.2596581 L11.6976366,17.7582967 Z"></path>
                                        </g>
                                      </g>
                                    </svg>
                                    <h6>Apagar</h6>
                                  </div>
                                </div>
                                <div
                                  className="item"
                                  onClick={() => {
                                    cloneItems(item);
                                    setDotMenu({ isTrue: false, id: -1 });
                                  }}
                                >
                                  <div className="row-sub-items">
                                    <svg
                                      width="20px"
                                      height="20px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M14 16.75H6C5.27065 16.75 4.57118 16.4603 4.05546 15.9445C3.53973 15.4288 3.25 14.7293 3.25 14V6C3.25 5.27065 3.53973 4.57118 4.05546 4.05546C4.57118 3.53973 5.27065 3.25 6 3.25H14C14.7293 3.25 15.4288 3.53973 15.9445 4.05546C16.4603 4.57118 16.75 5.27065 16.75 6V14C16.75 14.7293 16.4603 15.4288 15.9445 15.9445C15.4288 16.4603 14.7293 16.75 14 16.75ZM6 4.75C5.66848 4.75 5.35054 4.8817 5.11612 5.11612C4.8817 5.35054 4.75 5.66848 4.75 6V14C4.75 14.3315 4.8817 14.6495 5.11612 14.8839C5.35054 15.1183 5.66848 15.25 6 15.25H14C14.3315 15.25 14.6495 15.1183 14.8839 14.8839C15.1183 14.6495 15.25 14.3315 15.25 14V6C15.25 5.66848 15.1183 5.35054 14.8839 5.11612C14.6495 4.8817 14.3315 4.75 14 4.75H6Z"
                                        fill="#fff"
                                      />
                                      <path
                                        d="M18 20.75H10C9.27065 20.75 8.57118 20.4603 8.05546 19.9445C7.53973 19.4288 7.25 18.7293 7.25 18V16H8.75V18C8.75 18.3315 8.8817 18.6495 9.11612 18.8839C9.35054 19.1183 9.66848 19.25 10 19.25H18C18.3315 19.25 18.6495 19.1183 18.8839 18.8839C19.1183 18.6495 19.25 18.3315 19.25 18V10C19.25 9.66848 19.1183 9.35054 18.8839 9.11612C18.6495 8.8817 18.3315 8.75 18 8.75H16V7.25H18C18.7293 7.25 19.4288 7.53973 19.9445 8.05546C20.4603 8.57118 20.75 9.27065 20.75 10V18C20.75 18.7293 20.4603 19.4288 19.9445 19.9445C19.4288 20.4603 18.7293 20.75 18 20.75Z"
                                        fill="#fff"
                                      />
                                    </svg>
                                    <h6>Clonar</h6>
                                  </div>
                                </div>
                                <div id="item-move" className="item">
                                  <div className="move-container">
                                    <h6>Mover para a pasta</h6>
                                    <div className="width-container">
                                      <div className="move-menu">
                                        {folders.map((folderAgain) => {
                                          if (folderAgain != item.folder)
                                            return (
                                              <label
                                                onClick={() =>
                                                  editItems(
                                                    true,
                                                    item,
                                                    folderAgain
                                                  )
                                                }
                                              >
                                                {folderAgain}
                                              </label>
                                            );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="item"
                                  onClick={() => {
                                    copySubItems(item.user);
                                    setDotMenu({ isTrue: false, id: -1 });
                                  }}
                                >
                                  <h6>Copiar usuário</h6>
                                </div>
                                <div
                                  className="item"
                                  onClick={() => {
                                    copySubItems(item.password);
                                    setDotMenu({ isTrue: false, id: -1 });
                                  }}
                                >
                                  <h6>Copiar senha</h6>
                                </div>
                                <div
                                  className="item"
                                  onClick={() => {
                                    copySubItems(item.url);
                                    setDotMenu({ isTrue: false, id: -1 });
                                  }}
                                >
                                  <h6>Copiar URL</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h2>{item.title}</h2>
                          <div className="values-container">
                            <h3>
                              Usuário: <span>{item.user}</span>
                            </h3>
                            <h3>
                              Senha:
                              {showPass.isTrue === false ||
                              showPass.id != item.id ? (
                                <span> . . .</span>
                              ) : (
                                <span>{item.password}</span>
                              )}
                              {showPass.isTrue === false ||
                              showPass.id != item.id ? (
                                <svg
                                  width="25px"
                                  height="25px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() =>
                                    setShowPass({
                                      ...showPass,
                                      isTrue: true,
                                      id: item.id,
                                    })
                                  } /* importante */
                                >
                                  <path
                                    d="M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5"
                                    stroke="#434343"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="25px"
                                  height="25px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  onClick={() =>
                                    setShowPass({
                                      ...showPass,
                                      isTrue: false,
                                      id: item.id,
                                    })
                                  } /* importante */
                                >
                                  <path
                                    d="M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z"
                                    stroke="#434343"
                                  />
                                </svg>
                              )}
                            </h3>
                          </div>

                          <NextLink
                            className="link-button"
                            target="_blank"
                            href={item.url}
                          >
                            <button>Abrir Link</button>
                          </NextLink>
                        </div>
                      </div>
                    );
                })
              ) : (
                <div
                  className="message-container"
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translate(-50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <h3 style={{ fontSize: "22px" }}>
                    Nenhum item foi encontrado.
                  </h3>
                </div>
              )}
            </div>
          </>
        );
      })}

      <div className="add">
        <div className="plus-container">
          <svg
            style={
              editMenu || addMenu
                ? { visibility: "hidden", opacity: 0 }
                : undefined
            }
            fill="#434343"
            width="70px"
            height="70px"
            viewBox="0 0 56 56"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              setAddMenu(true);
              setEditMenu(false);
            }}
          >
            <path d="M 10.7851 20.7227 C 10.7851 14.0664 14.3008 10.6211 20.9804 10.6211 L 42.0273 10.6211 L 42.0273 10.0351 C 42.0273 5.2070 39.5664 2.7695 34.6679 2.7695 L 9.6367 2.7695 C 4.7382 2.7695 2.2773 5.2070 2.2773 10.0351 L 2.2773 34.6914 C 2.2773 39.5429 4.7382 41.9570 9.6367 41.9570 L 10.7851 41.9570 Z M 21.3555 53.2305 L 46.3868 53.2305 C 51.2617 53.2305 53.7227 50.8164 53.7227 45.9883 L 53.7227 21.0742 C 53.7227 16.2461 51.2617 13.8086 46.3868 13.8086 L 21.3555 13.8086 C 16.4336 13.8086 13.9960 16.2461 13.9960 21.0742 L 13.9960 45.9883 C 13.9960 50.8164 16.4336 53.2305 21.3555 53.2305 Z M 33.9179 44.0664 C 32.8398 44.0664 31.9726 43.1992 31.9726 42.0273 L 31.9726 35.5117 L 25.3867 35.5117 C 24.3086 35.5117 23.3242 34.5742 23.3242 33.4961 C 23.3242 32.4648 24.3086 31.5039 25.3867 31.5039 L 31.9726 31.5039 L 31.9726 25.0117 C 31.9726 23.8633 32.8398 22.9961 33.9179 22.9961 C 34.9960 22.9961 35.8398 23.8633 35.8398 25.0117 L 35.8398 31.5039 L 42.2148 31.5039 C 43.4101 31.5039 44.3944 32.4180 44.3944 33.4961 C 44.3944 34.5976 43.4101 35.5117 42.2148 35.5117 L 35.8398 35.5117 L 35.8398 42.0273 C 35.8398 43.1992 34.9960 44.0664 33.9179 44.0664 Z" />
          </svg>
        </div>
      </div>
      <div
        className="add-container"
        style={
          (addMenu && !editMenu) || editMenu
            ? { visibility: "visible", opacity: 1 }
            : undefined
        }
      >
        <div
          className="menu-background"
          onClick={() => {
            setAddMenu(false);
            setEditMenu(false);
          }}
        />
        <div className="menu-container">
          <svg
            width="50px"
            height="50px"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            fill="#434343"
            onClick={() => {
              setAddMenu(false);
              setEditMenu(false);
            }}
          >
            <path d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" />
          </svg>
          <div className="top-container">
            <h2>
              {addMenu && !editMenu ? (
                <span>Adicionar Item ao Cofre</span>
              ) : editMenu ? (
                <span>Editar Item no Cofre</span>
              ) : (
                <span>Fechando...</span>
              )}
            </h2>
          </div>
          <h3>URL</h3>
          <input
            type="text"
            placeholder={
              error.includes("Por favor informe o link.")
                ? "Por favor informe o link."
                : "Insira seu link aqui."
            }
            style={
              error.includes("Por favor informe o link.")
                ? { border: "1px solid red" }
                : undefined
            }
            value={urlInput}
            onChange={urlOnChange}
          />
          <div className="mid-container">
            <div className="sub-item">
              <h3>Pasta</h3>
              <input
                type="text"
                placeholder={
                  error.includes("Por favor informe a pasta.")
                    ? "Por favor informe a pasta."
                    : "Insira a pasta desejada aqui."
                }
                style={
                  error.includes("Por favor informe a pasta.")
                    ? { border: "1px solid red" }
                    : undefined
                }
                value={folderInput}
                onChange={folderOnChange}
              />
            </div>
            <div className="sub-item">
              <h3>Título</h3>
              <input
                type="text"
                placeholder={
                  error.includes("Por favor informe o título.")
                    ? "Por favor informe o título."
                    : "Insira seu título aqui."
                }
                style={
                  error.includes("Por favor informe o título.")
                    ? { border: "1px solid red" }
                    : undefined
                }
                value={titleInput}
                onChange={titleOnChange}
              />
            </div>
          </div>
          <div className="bottom-container">
            <div className="sub-item">
              <h3>Usuário</h3>
              <input
                type="user"
                placeholder={
                  error.includes("Por favor informe seu usuário.")
                    ? "Por favor informe seu usuário."
                    : "Insira o seu user aqui."
                }
                style={
                  error.includes("Por favor informe seu usuário.")
                    ? { border: "1px solid red" }
                    : undefined
                }
                value={userInput}
                onChange={userOnChange}
              />
            </div>
            <div className="sub-item">
              <h3>Senha</h3>
              <div className="pass-container">
                {!addShowPass ? (
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setAddShowPass(true)} /* importante */
                  >
                    <path
                      d="M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5"
                      stroke="#434343"
                    />
                  </svg>
                ) : (
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setAddShowPass(false)}/* importante */
                  >
                    <path
                      d="M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z"
                      stroke="#434343"
                    />
                  </svg>
                )}
                <input
                  type={!addShowPass ? "password" : "text"}
                  placeholder={
                    error.includes("Por favor informe sua senha.")
                      ? "Por favor informe sua senha."
                      : "Insira a sua senha aqui."
                  }
                  style={
                    error.includes("Por favor informe sua senha.")
                      ? { border: "1px solid red" }
                      : undefined
                  }
                  value={passwordInput}
                  onChange={passwordOnChange}
                />
              </div>
            </div>
          </div>
          <div className="submit-container">
            <button
              onClick={() => {
                !editMenu ? addItems(false) : editItems(false);
              }}
            >
              {!editMenu ? (
                <span>Adicionar Item</span>
              ) : (
                <span>Editar Item</span>
              )}
              <svg
                fill="#fff"
                height="25px"
                width="25px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 472.615 472.615"
              >
                <path d="M236.308,0C176.542,0,128,48.543,128,108.308v29.535h68.923v-29.535c0-21.761,17.625-39.385,39.385-39.385 s39.385,17.624,39.385,39.385v29.535h68.923v-29.535C344.615,48.543,296.074,0,236.308,0z" />

                <path d="M393.846,216.583v-59.044H275.692h-78.769H78.769v59.044h39.375v19.692H78.769v49.231h39.375v19.692H78.769v59.109 h147.692v30.818c-13.883,3.545-24.714,14.474-28.258,28.258H128v19.692h70.203c4.332,16.935,19.791,29.539,38.105,29.539 s33.772-12.603,38.105-29.539h70.203v-19.692h-70.203c-3.545-13.785-14.375-24.714-28.258-28.258v-30.818h147.692v-59.109h-39.394 v-19.692h39.394v-49.231h-39.394v-19.692H393.846z M216.615,309.276l-36.5-36.5l13.922-13.923l22.577,22.577l61.962-61.962 l13.922,13.923L216.615,309.276z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </S.Reader>
  );
}
