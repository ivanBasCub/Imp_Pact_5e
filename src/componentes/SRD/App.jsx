import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Footer from "../Footer"
import Header from "../Header"

export default function App(){
    return (
        <>
        <Header/>
        <div className="container">
              <div className="row g-4">
              <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/rules" className="text-decoration-none">
                    <div className="card">
                      <img src="images/rules.png" alt="rules" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Rules</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/classes" className="text-decoration-none">
                    <div className="card">
                      <img src="images/classes.png" alt="classes" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Classes</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/race" className="text-decoration-none">
                    <div className="card">
                      <img src="/images/dwarf.png" alt="races" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Races</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/monsters" className="text-decoration-none">
                    <div className="card">
                      <img src="/images/monsters.png" alt="monstros" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Monsters</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/spells" className="text-decoration-none">
                    <div className="card">
                      <img src="/images/spells.png" alt="spells" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Spells</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/equipments" className="text-decoration-none">
                    <div className="card">
                      <img src="/images/equipment.jpg" alt="equipment" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Equipment</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/magic_items" className="text-decoration-none">
                    <div className="card">
                      <img src="/images/magicItem.jpg" alt="magic items" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Magic Items</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/feats" className="text-decoration-none">
                    <div className="card">
                      <img src="/images/feats.png" alt="feats" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Feats</h2>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <Link to="/SRD/backgrounds" className="text-decoration-none">
                    <div className="card">
                      <img src="/images/backgrounds.png" alt="backgrounds" className="card-img-top" />
                      <div className="card-body">
                        <h2 className="card-title">Backgrounds</h2>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <Footer/>
            </>
    )
}