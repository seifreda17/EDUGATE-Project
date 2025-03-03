import React from "react";
import { price } from "../../data/Data";

const PriceCard = () => {
    return (
        <>
            <div className='content flex mtop'>
                {price.map((item, index) => (
                    <div className='box shadow' key={index}>
                        <div className='topbtn'>
                            <button className='btn3'>{item.best}</button>
                        </div>
                        <h3>{item.plan}</h3>
                        <h1>
                            <span>LE</span> {item.price}
                        </h1>
                        <p>{item.ptext}</p>
                        <ul>
                            {item.list.map((val, i) => {
                                const { icon, text, change } = val;
                                return (
                                    <li key={i}>
                                        <label
                                            style={{
                                                background: change === "color" ? "#dc35451f" : "#2766ae1f",
                                                color: change === "color" ? "#dc3848" : "#2766ae"
                                            }}
                                        >
                                            {icon}
                                        </label>
                                        <p>{text}</p>
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            className='btn5'
                            style={{
                                background: item.plan === "Best School" ? "#2766ae" : "#fff",
                                color: item.plan === "Best School" ? "#fff" : "#2766ae"
                            }}
                        >
                            {item.plan}
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PriceCard;
