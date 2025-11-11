import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Concert {
    id: string;
    name: string;
    artistId: string;
    artistName: string;
    venue: string;
    date: string;
    time: string;
    price: number;
    availableTickets: number;
    totalTickets: number;
    continent: string;
    image: string;
    description: string;
}

interface ContinentSummary {
    [key: string]: number;
}

const BookConcerts: React.FC = () => {
    const [concerts, setConcerts] = useState<Concert[]>([]);
    const [continentSummary, setContinentSummary] = useState<ContinentSummary>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [filterContinent, setFilterContinent] = useState<string>("All");
    const navigate = useNavigate();

    useEffect(()=>{
        fetchConcerts();
    },[]);
    
    const fetchConcerts = async() =>{
        try{
            const response = await axios.get<Concert[]>("http://localhost:3001/concerts");
            setConcerts(response.data);
            calculateContinentSummary(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load concerts");
            setLoading(false);
        }
    }

    const calculateContinentSummary = (concertData : Concert[]) =>{
        const summary : ContinentSummary = {};
        concertData.forEach ((concert)=>{
            if(summary[concert.continent]){
                summary[concert.continent]++;
            }else{
                summary[concert.continent] = 1;
            }
        })

        setContinentSummary(summary);
    }
    const handleBookNow = (concertId: string) => {
        navigate('/purchase/'+concertId);
    };

    const filteredConcerts = filterContinent === "All" ? concerts : concerts.filter(concert=>concert.continent === filterContinent)
     if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    return(
        <div className="container mt-4">
            <h2 className="mb-4">Book Concerts 🎫</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {/* Continent Summary */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Concerts by Continent 🌍</h5>
                    <div className="row">
                        {Object.entries(continentSummary).map(([continent, count]) => (
                            <div key={continent} className="col-md-3 col-sm-6 mb-2">
                                <div className="p-3 bg-light rounded text-center">
                                    <strong>{continent}:</strong> {count} concert{count !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/*filter by continent */}
            <div className="mb-4">
                <label htmlFor="continentFilter" className="form-label">Filter by Continent:</label>
                <select
                    id="continentFilter"
                    className="form-select"
                    value={filterContinent}
                    onChange={(e) => setFilterContinent(e.target.value)}
                >
                    <option value="All">All Continents</option>
                    {Object.keys(continentSummary).map((continent) => (
                        <option key={continent} value={continent}>
                            {continent}
                        </option>
                    ))}
                </select>
            </div>
            {/* Concerts List */}
            <div className="row">
                {filteredConcerts.map((concert) => (
                    <div key={concert.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={concert.image}
                                className="card-img-top"
                                alt={concert.name}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{concert.name}</h5>
                                <p className="card-text">
                                    <strong>Artist:</strong> {concert.artistName}<br />
                                    <strong>Date:</strong> {new Date(concert.date).toLocaleDateString()}<br />
                                    <strong>Time:</strong> {concert.time}<br />
                                    <strong>Venue:</strong> {concert.venue}<br />
                                    <strong>Continent:</strong> {concert.continent}<br />
                                    <strong>Price:</strong> ${concert.price}
                                </p>
                                <p className="card-text text-muted small">{concert.description}</p>
                                <div className="mt-auto">
                                    {concert.availableTickets === 0 ? (
                                        <button className="btn btn-danger w-100" disabled>
                                            🚫 Sold Out
                                        </button>
                                    ) : (
                                        <>
                                            <p className="mb-2">
                                                <span className="badge bg-success">
                                                    {concert.availableTickets} tickets available
                                                </span>
                                            </p>
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => handleBookNow(concert.id)}
                                            >
                                                🎫 Book Now
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
               {filteredConcerts.length === 0 && (
                <div className="alert alert-info" role="alert">
                    No concerts found for the selected continent.
                </div>
            )}
        </div>        
    )
}
export default BookConcerts;
