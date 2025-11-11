import React, { useEffect, useState } from "react";
import axios from "axios";

interface PurchaseHistory {
    id: string;
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
const PurchaseHis: React.FC = () => {
    const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const userDetails = sessionStorage.getItem("user");
    const user = userDetails ? JSON.parse(userDetails) : null;

    useEffect(() => {
        if (user) {
            fetchPurchaseHistory();
        }
    }, []);

    const fetchPurchaseHistory = async () => {
        try {
            const response = await axios.get<PurchaseHistory[]>(
                `http://localhost:3001/purchaseHistory?userId=${user.id}`
            );
            const sortedPurchases = response.data.sort((a, b) => 
                new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
            );
             setPurchases(sortedPurchases);
            setLoading(false);
        } catch (err) {
            setError("Failed to load purchase history");
            setLoading(false);
        }
    };

    const calculateTotalSpent = (): number => {
        return purchases.reduce((total, purchase) => total + purchase.totalPrice, 0);
    };

    const calculateTotalTickets = (): number => {
        return purchases.reduce((total, purchase) => total + purchase.ticketsBought, 0);
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

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Purchase History 🎫</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {purchases.length > 0 ? (
                <>
                    {/* Summary Cards */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Total Purchases</h5>
                                    <h2 className="text-primary">{purchases.length}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Total Tickets</h5>
                                    <h2 className="text-success">{calculateTotalTickets()}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Total Spent</h5>
                                    <h2 className="text-danger">${calculateTotalSpent()}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purchase History Table */}
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Concert</th>
                                            <th>Artist</th>
                                            <th>Venue</th>
                                            <th>Concert Date</th>
                                            <th>Tickets</th>
                                            <th>Total Price</th>
                                            <th>Purchase Date</th>
                                        </tr>
                                    </thead>
                                     <tbody>
                                        {purchases.map((purchase) => (
                                            <tr key={purchase.id}>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        #{purchase.id.substring(0, 8)}
                                                    </span>
                                                </td>
                                                <td><strong>{purchase.concertName}</strong></td>
                                                <td>{purchase.artistName}</td>
                                                <td>{purchase.venue}</td>
                                                <td>
                                                    {new Date(purchase.date).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {purchase.ticketsBought} ticket(s)
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>${purchase.totalPrice}</strong>
                                                </td>
                                                <td>
                                                    {new Date(purchase.purchaseDate).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Purchase Cards for Mobile View */}
                    <div className="d-md-none mt-3">
                        {purchases.map((purchase) => (
                            <div key={purchase.id} className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{purchase.concertName}</h5>
                                    <p className="card-text">
                                        <strong>Artist:</strong> {purchase.artistName}<br />
                                        <strong>Venue:</strong> {purchase.venue}<br />
                                        <strong>Concert Date:</strong> {new Date(purchase.date).toLocaleDateString()}<br />
                                        <strong>Tickets:</strong> {purchase.ticketsBought}<br />
                                        <strong>Total Price:</strong> ${purchase.totalPrice}<br />
                                        <strong>Purchased:</strong> {new Date(purchase.purchaseDate).toLocaleString()}
                                    </p>
                                    <span className="badge bg-secondary">
                                        Order #{purchase.id.substring(0, 8)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                 ) : (
                <div className="alert alert-info" role="alert">
                    <h5>No purchase history yet!</h5>
                    <p>You haven't purchased any concert tickets yet. Browse our concerts and book your first show!</p>
                    <a href="/book-concerts" className="btn btn-primary">
                        Browse Concerts
                    </a>
                </div>
            )}
        </div>
    );
};

export default PurchaseHis;