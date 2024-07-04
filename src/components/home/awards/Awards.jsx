import React from "react";
import Heading from "../../common/Heading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Awards = () => {
  return (
    <>
      <section className='awards padding'>
        <div className='container'>
          <Heading title='Your feedback matters! Help us enhance your browsing experience by sharing your thoughts'  />
          <div style={{
            display: 'flex',
            justifyContent: 'center', // Center the stars horizontally
            alignItems: 'center' // Center the stars vertically
          }}>
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px', marginRight: '5px' }} />
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px', marginRight: '5px' }} />
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px', marginRight: '5px' }} />
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px', marginRight: '5px' }} />
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '24px' }} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Awards;