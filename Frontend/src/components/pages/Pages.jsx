import React from "react"
import Header from "../common/header/Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "../home/Home"
import Footer from "../common/footer/Footer"
import About from "../about/About"
import Pricing from "../pricing/Pricing"
import Blog from "../blog/Blog"
import Services from "../services/Services"
import Contact from "../contact/Contact"
import Register from "../../components/home/Register/Register"
import login from "../../components/home/Login/Login"
import ManageSchools from "../home/ManageSchools/ManageSchools"
import Detailspage from "../DetailsPage/DetailsPage"
import ContactAdmin from "../ContactAdmin/ContactAdmin"
import FavoriteList from "../FavoriteList/FavoriteList"


const Pages = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/services' component={Services} />
          <Route exact path='/blog' component={Blog} />
          <Route exact path='/pricing' component={Pricing} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/Register' component={Register} />
          <Route exact path='/Login' component={login} />
          <Route exact path="/ManageSchools" component={ManageSchools} />
          <Route path="/DetailsPage/:ID" component={Detailspage} />
          <Route path="/ContactAdmin" component={ContactAdmin} />
          <Route path="/FavoriteList" component={FavoriteList} />
        </Switch>
        <Footer />
      </Router>
    </>
  )
}

export default Pages