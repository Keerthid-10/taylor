import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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

interface PurchaseHistory {
    userId: string;
    userName: string;
    concertId: string;
    concertName: string;
    artistName: string;
    venue: string;
    date: string;
    ticketsBought: number;
    totalPrice: number;
    purchaseDate: string;
}

const Purchase: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [concert, setConcert] = useState<Concert | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [ticketCount, setTicketCount] = useState<number>(1);
    const [purchasing, setPurchasing] = useState<boolean>(false);

    const userDetails = sessionStorage.getItem("user");
    const user = userDetails ? JSON.parse(userDetails) : null;

    useEffect(() => {
        if (id) {
            fetchConcertDetails(id);
        }
    }, [id]);

    const fetchConcertDetails = async (concertId: string) => {
        try {
            const response = await axios.get<Concert>(
                `http://localhost:3001/concerts/${concertId}`
            );
            setConcert(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load concert details");
            setLoading(false);
        }
    };

    const handleTicketChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const value = parseInt(e.target.value);

        if(concert && value > 0 && value <= concert.availableTickets){
            setTicketCount(value);
        }
    }

    const handleBuyNow = async () => {
        if (!user) {
            setError("Please login to purchase tickets");
            return;
        }

        if (!concert) {
            setError("Concert details not found");
            return;
        }

        if (ticketCount > concert.availableTickets) {
            setError("Not enough tickets available");
            return;
        }

        setPurchasing(true);
        try {
            // Create purchase history entry
            const purchaseData: PurchaseHistory = {
                userId: user.id,
                userName: user.userName,
                concertId: concert.id,
                concertName: concert.name,
                artistName: concert.artistName,
                venue: concert.venue,
                date: concert.date,
                ticketsBought: ticketCount,
                totalPrice: concert.price * ticketCount,
                purchaseDate: new Date().toISOString()
            };

            await axios.post("http://localhost:3001/purchaseHistory", purchaseData);

            // Update available tickets
            const updatedTickets = concert.availableTickets - ticketCount;
            await axios.patch(`http://localhost:3001/concerts/${concert.id}`, {
                availableTickets: updatedTickets
            });
            alert(`Successfully purchased ${ticketCount} ticket(s)!`);
            navigate("/purchase-history");
        } catch (err) {
            setError("Failed to complete purchase. Please try again.");
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    if (!concert) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    Concert not found
                </div>
            </div>
        );
    }
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={concert.image}
                        alt={concert.name}
                        className="img-fluid rounded shadow"
                        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>{concert.name}</h2>
                    <hr />
                    <div className="mb-3">
                        <p><strong>Artist:</strong> {concert.artistName}</p>
                        <p><strong>Venue:</strong> {concert.venue}</p>
                        <p><strong>Date:</strong> {new Date(concert.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {concert.time}</p>
                        <p><strong>Continent:</strong> {concert.continent}</p>
                        <p><strong>Price per Ticket:</strong> ${concert.price}</p>
                        <p>
                            <strong>Available Tickets:</strong>{" "}
                            <span className="badge bg-success">{concert.availableTickets}</span>
                        </p>
                    </div>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                     {concert.availableTickets > 0 ? (
                        <div className="card p-3 shadow-sm">
                            <h5>Purchase Tickets</h5>
                            <div className="mb-3">
                                <label htmlFor="ticketCount" className="form-label">
                                    Number of Tickets:
                                </label>
                                <input
                                    type="number"
                                    id="ticketCount"
                                    className="form-control"
                                    value={ticketCount}
                                    onChange={handleTicketChange}
                                    min="1"
                                    max={concert.availableTickets}
                                />
                            </div>
                            <div className="mb-3">
                                <h5>Total Price: ${concert.price * ticketCount}</h5>
                            </div>
                            <button
                                className="btn btn-success btn-lg w-100"
                                onClick={handleBuyNow}
                                disabled={purchasing}
                            >
                                {purchasing ? "Processing..." : "💳 Buy Now"}
                            </button>
                        </div>
                         ) : (
                        <div className="alert alert-danger" role="alert">
                            This concert is sold out!
                        </div>
                    )}

                    <button
                        className="btn btn-secondary mt-3"
                        onClick={() => navigate("/book-concerts")}
                    >
                        ← Back to Concerts
                    </button>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12">
                    <h4>About this Concert</h4>
                    <p>{concert.description}</p>
                </div>
            </div>
        </div>

    );
};

export default Purchase;