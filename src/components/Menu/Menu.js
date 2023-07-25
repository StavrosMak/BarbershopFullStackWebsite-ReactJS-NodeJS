import React, { useState, useEffect } from "react";
import './Menu.css';
import menuIcon from '../../Images/Menu2.png';
import FlipCard from "../FlipCard/FlipCard";
import useFetchData from "../../CustomHooks/useFetchData";

export default function Menu() {
    const [cards, setCards] = useState([]);
    const { data } = useFetchData('cards')
    useEffect(() => {
        setCards(data);
    }, [data, cards]);

    return (
        <div className="Menu" id='services'>
            <img src={menuIcon} className="MenuIcon" alt="MenuIcon" />
            <div className="MenuList">
                {cards.map(card => (
                    <div className="MenuItem" key={card.ServiceID}>
                        <FlipCard
                            frontContent={card.serviceName}
                            backContent={card.serviceDesc}
                            price={card.servicePrice}
                            // image={`require("../../${card.serviceImage}`}
                            image={require(`../../Images/${card.serviceImage}`)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}



