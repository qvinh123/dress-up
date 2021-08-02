import React, { useState } from "react";

import Button from "../Components/Button/Button";
import ButtonChoose from "../Components/ButtonChoose/ButtonChoose";
import ModelImage from "../Components/ModelImage/ModelImage";

import { importImage } from "../helper/importImage";
import { data } from "../data";

import classes from "./Home.module.css";

import { toPng } from "html-to-image";
import download from "downloadjs";

export default function Home() {
    const [tops, setTops] = useState(null);
    const [outer, setOuter] = useState(null);
    const [pants, setPants] = useState(null);
    const [glass, setGlass] = useState(null);
    const [shoe, setShoe] = useState(null);
    const [hat, setHat] = useState(null);

    const [dataState, setDataState] = useState(data);

    // ========== Remove Active First ==========
    const removeActiveFirst = (listActive) => {
        if (listActive.length >= 2) {
            const obiectActive = listActive.find(ac => ac.active)
            delete obiectActive.active
        }
    }

    // ========== Active Button Top ==========
    const setActiveBtnTop = (objIngredient) => {
        const cloneData = [...dataState];
        const indexNameFolder = cloneData.indexOf(objIngredient);

        cloneData.forEach((ac) => (ac.active = false));
        cloneData[indexNameFolder].active = true;

        cloneData[indexNameFolder].items[0].active = true;

        const listActive = cloneData[indexNameFolder].items.filter((ac) => ac.active === true);

        removeActiveFirst(listActive)
        setDataState(cloneData);
    }


    // ========== Active Button Middle ==========
    const setActiveBtnMiddle = (objIngredient, objStyle) => {
        const cloneData = [...dataState];

        const indexNameFolder = cloneData.indexOf(objIngredient);
        const indexNameFile = cloneData[indexNameFolder].items.indexOf(objStyle);

        cloneData[indexNameFolder].items.forEach((ac) => (ac.active = false));
        cloneData[indexNameFolder].items[indexNameFile].active = true;

        cloneData[indexNameFolder].items[indexNameFile].listImageColor.forEach((ac) => (ac.active = false));
        cloneData[indexNameFolder].items[indexNameFile].listImageColor[0].active = true;
        const listActive = cloneData[indexNameFolder].items[indexNameFile].listImageColor.filter((ac) => ac.active === true);

        removeActiveFirst(listActive)
        setDataState(cloneData);
    };


    // ========== Active Button Bottom ==========
    const setActiveBtnBottom = (objIngredient, objStyle, objStyleBg) => {
        const cloneData = [...dataState];

        const indexNameFolder = cloneData.indexOf(objIngredient);
        const indexNameFile = cloneData[indexNameFolder].items.indexOf(objStyle);
        const indexNameFileBg = cloneData[indexNameFolder].items[indexNameFile]?.listImageColor.indexOf(objStyleBg)

        cloneData[indexNameFolder].items[indexNameFile].listImageColor.forEach(ac => (ac.active = false));

        cloneData[indexNameFolder].items[indexNameFile].listImageColor[indexNameFileBg].active = true;
        setDataState(cloneData);
    };


    // ========== Change Image ==========
    const changeImage = (objIngredient, objStyle) => {
        const { nameFolder } = objIngredient;
        const { nameFile } = objStyle;

        importImage(nameFolder, nameFile, (image) => {
            switch (nameFolder) {
                case "tops":
                    setTops(image);
                    break;
                case "outer":
                    setOuter(image);
                    break;
                case "pants":
                    setPants(image);
                    break;
                case "hat":
                    setHat(image);
                    break;
                case "shoe":
                    setShoe(image);
                    break;
                case "glass":
                    setGlass(image);
                    break;
                default:
                    break;
            }
        });
    };

    // ========== Render List Choose Top ==========
    const renderChooseTop = () => {
        return dataState.map((objIngredient) => {
            return (
                <ButtonChoose
                    active={objIngredient.active}
                    click={() => {
                        setActiveBtnTop(objIngredient)
                    }}
                    key={objIngredient.name}
                    name={objIngredient.name}
                    label={objIngredient.nameFolder}
                />
            );
        });
    };


    // ========== Render List Choose Middle ==========
    const renderChooseMiddle = () => {
        return dataState
            .filter((objIngredient) => objIngredient.active)
            .map((objIngredient) => {
                return objIngredient.items.map((ingredient) => {
                    return (
                        <ButtonChoose
                            active={ingredient.active}
                            click={() => {
                                setActiveBtnMiddle(objIngredient, ingredient);
                                changeImage(objIngredient, ingredient.listImageColor[0]);
                            }}
                            key={ingredient.name}
                            name={ingredient.name}
                            label={ingredient.nameFolder}
                        />
                    );
                });
            });
    };

    // ========== Render List Choose Bottom ==========
    const renderChooseBottom = () => {
        return dataState
            .filter((objIngredient) => objIngredient.active)
            .map((objIngredient) => {
                return objIngredient.items
                    .filter((ingredient) => ingredient.active)
                    .map((ingredient) => {
                        return ingredient.listImageColor?.map((item) => {
                            return (
                                item.name &&
                                <ButtonChoose
                                    active={item.active}
                                    click={() => {
                                        setActiveBtnBottom(objIngredient, ingredient, item);
                                        changeImage(objIngredient, item);
                                    }}
                                    key={item.name}
                                    name={item.name}
                                    label={item.nameFolder}
                                />
                            );
                        });
                    });
            });
    };

    // ========== DownLoad PNG Alpaca ==========
    const downloadPNG = () => {
        toPng(document.getElementById("model__image-download")).then((dataUrl) => {
            download(dataUrl, "model.png");
        });
    }

    // ========== Random Ingrdient Alpaca ==========
    const random = () => {
        return dataState.map((objIngredient) => {
            const resultRandomItems = Math.floor(
                Math.random() * objIngredient.items?.length
            )
            return objIngredient.items
                .filter((ingredient) => ingredient.id === resultRandomItems).map(ingredient => {
                    const resultRandom = Math.floor(
                        Math.random() * ingredient.listImageColor?.length
                    )
                    return ingredient.listImageColor.filter(item => item.id === resultRandom).map(item => changeImage(objIngredient, item))
                })
        });
    };


    const propsImageModel = {
        tops,
        outer,
        pants,
        hat,
        shoe,
        glass,
    };

    return (
        <div className={classes.model__content}>
            <div className={classes["model__content--left"]}>
                <div id="model__image-download" className={classes.model__image}>
                    <ModelImage propsImageModel={propsImageModel} />
                </div>

                <div className={classes["model__list--btn"]}>
                    <Button click={() => random()}>
                        <span className={classes.model__icon}>
                            <i className="fas fa-random"></i>
                        </span>
                    </Button>
                    <Button click={() => downloadPNG()}>
                        <span className={classes.model__icon}>
                            <i className="fas fa-download"></i>
                        </span>
                    </Button>
                </div>
            </div>

            <div className={classes["model__content--right"]}>
                <div className={classes.model__choose}>
                    <div className={classes["model__choose--top"]}>
                        <h3>Accessorize</h3>
                        <ul>{renderChooseTop()}</ul>
                    </div>
                    <div className={classes["model__choose--middle"]}>
                        <ul>{renderChooseMiddle()}</ul>
                    </div>

                    <div className={classes["model__choose--bottom"]}>
                        <ul>{renderChooseBottom()}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
