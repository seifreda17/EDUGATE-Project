import React from "react";
import Heading from "../../common/Heading";
import "./recent.css";
import RecentCard from "./RecentCard";

const Recent = () => {
  return (
    <>
      <section className="recent padding">
        <div className="container">
          <Heading
            title="Recommended Schools"
            subtitle="Explore and compare a comprehensive range of educational institutions."
          />
          <RecentCard />
        </div>{" "}
      </section>{" "}
    </>
  );
};

export default Recent;
