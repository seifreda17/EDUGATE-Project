import React from "react";
import Back from "../common/Back";
import Heading from "../common/Heading";
import img from "../images/about.jpg";
import "./about.css";

const About = () => {
  return (
    <>
      <section className='about'>
        <Back name='About Us' title='About Us - Who We Are?' cover={img} />
        <div className='container flex mtop'>
          <div className='left row'>
            <Heading title='Our platform Story' subtitle='' />


<p> At Edugate, our soul focus is to assist you in finding the perfect school for your child's education by taking into account their unique preferences, requirements, and goals. We understand that every child is different, and their educational journey should reflect their individual needs.

Our platform is meticulously designed to make the school search process simpler and more efficient for parents like you. We aim to provide you with a seamless experience where you can easily explore and compare a comprehensive range of educational institutions. 
.</p>
<Heading title='National & International Schools' subtitle='' />
    <p> National Schools offer an affordable, culturally rooted education, ideal for students aiming for local higher education. International Schools provide a global perspective and diverse environment, preparing students for international academia and careers, at a higher cost. The choice depends on educational priorities, cultural exposure, and future aspirations.

</p>    
<Heading title='Governmental & Private Schools' subtitle='' />
<p> Governmental Schools are ideal for families seeking low-cost education with a curriculum that aligns with national standards, reflecting local diversity. Private Schools offer more personalized education, diverse curricula, and superior resources at a higher cost, often preparing students for global opportunities. The choice depends on factors like budget, educational goals, and the desired learning environment. </p>
<Heading title='General & Stem Schools' subtitle='' />
<p>General Schools offer a broad, well-rounded education suitable for students with diverse interests and career goals. They emphasize a balanced development of various skills and provide a wide range of extracurricular activities.

STEM Schools specialize in science and technology education, fostering technical skills, analytical thinking, and innovation. They are ideal for students with a strong interest in STEM fields and offer advanced resources and specialized extracurricular activities.

The choice between general and STEM schools depends on the student's interests, career aspirations, and learning preferences. Parents should consider these factors along with the specific offerings and environment of the schools in their area.

</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;