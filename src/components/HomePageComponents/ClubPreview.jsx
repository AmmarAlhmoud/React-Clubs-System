import React from "react";
import ClubContainer from "./ClubContainer";
import P1 from '../../assets/img1.png';
import P2 from '../../assets/img2.png';
import P3 from '../../assets/img3.png';
import P4 from '../../assets/img4.png';
import P5 from '../../assets/img5.png';
import P6 from '../../assets/img6.png';
import TitleDescription from './TitleDescription';
import './ClubPreview.css';

const ClubPreview = () => {
    const clubsData = [
        { image: P1, title: "Istanbul sile", description: "Oh my God!" },
        { image: P2, title: "Africa", description: "who cares " },
        { image: P3, title: "Bali Indonesia", description: "i hate programming" },
        { image: P4, title: "Sydney Australia", description: "css is shit!" },
        { image: P5, title: "Morocco Africa", description: "i am exhausted" },
        { image: P6, title: "Alberta Canada", description: "can't wait" },
    ];

    // Split clubsData into chunks of 3
    const clubsChunks = [];
    for (let i = 0; i < clubsData.length; i += 3) {
        clubsChunks.push(clubsData.slice(i, i + 3));
    }

    return (
        <div className="club-section">
            <TitleDescription
                title="Events"
                description="upcoming events for this month"
            />
           
            <div className="club-container">
                {clubsChunks.map((chunk, index) => (
                    <div className="row" key={index}>
                        {chunk.map((club, innerIndex) => (
                            <ClubContainer
                                key={innerIndex}
                                image={club.image}
                                title={club.title}
                                description={club.description}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClubPreview;
