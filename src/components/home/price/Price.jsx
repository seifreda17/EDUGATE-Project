import React from "react";
import Heading from "../../common/Heading";
import "./price.css";
import PriceCard from "./PriceCard";

const Price = () => {
  return (
    <>
      <section className="price padding">
        <div className="container">
          <Heading
            title="Top ranked Schools"
            subtitle="we've put together a list of the top 3 schools in Cairo, Egypt."
          />
          <PriceCard />
        </div>
      </section>
    </>
  );
};

export default Price;
