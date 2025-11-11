import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface UserDetails {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    continent: string;
    isAuthenticated: boolean;
}

interface Artist {
    id: string;
    name: string;
    genre: string;
    country: string;
    image: string;
    description: string;
}

interface Favorite {
    id: string;
    userId: string;
    artistId: string;
    artistName: string;
    artistImage: string;
}

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
    continent: string;
    image: string;
}

interface PurchaseHistory {
    id: string;
    userId: string;
    concertId: string;
    concertName: string;
    artistName: string;
    venue: string;
    date: string;
    ticketsBought: number;
    totalPrice: number;
    purchaseDate: string;
}

const Home: React.FC = () => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [upcomingConcerts, setUpcomingConcerts] = useState<Concert[]>([]);
    const [pastPurchases, setPastPurchases] = useState<PurchaseHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const userDetails = sessionStorage.getItem("user");
        if (userDetails) {
            const userData = JSON.parse(userDetails);
            setUser(userData);
            fetchAllData(userData.id);
        }
    }, []);

    const fetchAllData = async (userId: string) => {
        try {
            // Fetch all data in parallel
            const [artistsRes, favoritesRes, concertsRes, purchasesRes] = await Promise.all([
                axios.get<Artist[]>("http://localhost:3001/artists"),
                axios.get<Favorite[]>(`http://localhost:3001/favorites?userId=${userId}`),
                axios.get<Concert[]>("http://localhost:3001/concerts"),
                axios.get<PurchaseHistory[]>(`http://localhost:3001/purchaseHistory?userId=${userId}`)
            ]);

            setArtists(artistsRes.data.slice(0, 6)); // Show first 6 artists
            setFavorites(favoritesRes.data);
            
            // Filter upcoming concerts (future dates with available tickets)
            const today = new Date();
            const upcoming = concertsRes.data
                .filter(concert => new Date(concert.date) >= today && concert.availableTickets > 0)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 4); // Show first 4 upcoming concerts
            setUpcomingConcerts(upcoming);

            // Sort past purchases by date (most recent first) and show last 3
            const sorted = purchasesRes.data.sort((a, b) => 
                new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
            ).slice(0, 3);
            setPastPurchases(sorted);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setErrorMsg("Failed to load some data");
            setLoading(false);
        }
    };

    const isArtistFavorited = (artistId: string): boolean => {
        return favorites.some((fav) => fav.artistId === artistId);
    };

    const handleAddToFavorites = async (artist: Artist) => {
        if (!user) {
            setErrorMsg("Please login to add favorites");
            return;
        }

        if (isArtistFavorited(artist.id)) {
            setErrorMsg("Artist is already in your favorites!");
            setTimeout(() => setErrorMsg(""), 3000);
            return;
        }

        try {
            const favoriteData: Favorite = {
                id: "",
                userId: user.id,
                artistId: artist.id,
                artistName: artist.name,
                artistImage: artist.image
            };

            const response = await axios.post("http://localhost:3001/favorites", favoriteData);
            setFavorites([...favorites, response.data]);
            setSuccessMsg(`${artist.name} added to favorites!`);
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            setErrorMsg("Failed to add to favorites");
            setTimeout(() => setErrorMsg(""), 3000);
        }
    };

    const handleRemoveFavorite = async (favoriteId: string) => {
        try {
            await axios.delete(`http://localhost:3001/favorites/${favoriteId}`);
            setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
            setSuccessMsg("Removed from favorites!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            setErrorMsg("Failed to remove favorite");
            setTimeout(() => setErrorMsg(""), 3000);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            {/* Welcome Section */}
            <div className="jumbotron bg-gradient p-5 rounded shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                <h1 className="display-4">Welcome back, {user?.userName}! 🎵</h1>
                <p className="lead">Discover amazing artists, book concerts, and enjoy live music!</p>
                <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.3)" }} />
                <div className="row text-center mt-4">
                    <div className="col-md-3 col-6 mb-3">
                        <div className="bg-white text-dark p-3 rounded shadow-sm">
                            <h3 className="mb-0">{favorites.length}</h3>
                            <small>Favorites</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6 mb-3">
                        <div className="bg-white text-dark p-3 rounded shadow-sm">
                            <h3 className="mb-0">{upcomingConcerts.length}</h3>
                            <small>Upcoming</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6 mb-3">
                        <div className="bg-white text-dark p-3 rounded shadow-sm">
                            <h3 className="mb-0">{pastPurchases.length}</h3>
                            <small>Past Shows</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6 mb-3">
                        <div className="bg-white text-dark p-3 rounded shadow-sm">
                            <h3 className="mb-0">{artists.length}+</h3>
                            <small>Artists</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success and Error Messages */}
            {successMsg && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMsg}
                    <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
                </div>
            )}

            {errorMsg && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorMsg}
                    <button type="button" className="btn-close" onClick={() => setErrorMsg("")}></button>
                </div>
            )}

            {/* Featured Artists Section */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>🎤 Featured Artists</h3>
                    <Link to="/artists" className="btn btn-outline-primary btn-sm">
                        View All Artists →
                    </Link>
                </div>
                <div className="row">
                    {artists.map((artist) => (
                        <div key={artist.id} className="col-lg-2 col-md-4 col-sm-6 mb-4">
                            <div className="card h-100 shadow-sm hover-card">
                                <img
                                    src={artist.image}
                                    className="card-img-top"
                                    alt={artist.name}
                                    style={{ height: "150px", objectFit: "cover" }}
                                />
                                <div className="card-body d-flex flex-column p-2">
                                    <h6 className="card-title mb-1">{artist.name}</h6>
                                    <p className="card-text small text-muted mb-2">{artist.genre}</p>
                                    <button
                                        className={`btn btn-sm mt-auto ${
                                            isArtistFavorited(artist.id)
                                                ? "btn-success"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() => handleAddToFavorites(artist)}
                                        disabled={isArtistFavorited(artist.id)}
                                    >
                                        {isArtistFavorited(artist.id) ? "✓ Favorited" : "⭐ Add"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Favorite Artists Section */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>⭐ Your Favorite Artists</h3>
                    <Link to="/favorites" className="btn btn-outline-primary btn-sm">
                        Manage Favorites →
                    </Link>
                </div>
                {favorites.length > 0 ? (
                    <div className="row">
                        {favorites.slice(0, 6).map((favorite) => (
                            <div key={favorite.id} className="col-lg-2 col-md-4 col-sm-6 mb-4">
                                <div className="card h-100 shadow-sm hover-card">
                                    <img
                                        src={favorite.artistImage}
                                        className="card-img-top"
                                        alt={favorite.artistName}
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                    <div className="card-body d-flex flex-column p-2">
                                        <h6 className="card-title mb-2">{favorite.artistName}</h6>
                                        <button
                                            className="btn btn-danger btn-sm mt-auto"
                                            onClick={() => handleRemoveFavorite(favorite.id)}
                                        >
                                            ❌ Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <p className="mb-0">You haven't added any favorites yet. Start exploring artists above!</p>
                    </div>
                )}
            </div>

            {/* Upcoming Concerts Section */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>🎫 Upcoming Concerts</h3>
                    <Link to="/book-concerts" className="btn btn-outline-primary btn-sm">
                        View All Concerts →
                    </Link>
                </div>
                {upcomingConcerts.length > 0 ? (
                    <div className="row">
                        {upcomingConcerts.map((concert) => (
                            <div key={concert.id} className="col-md-6 col-lg-3 mb-4">
                                <div className="card h-100 shadow-sm hover-card">
                                    <img
                                        src={concert.image}
                                        className="card-img-top"
                                        alt={concert.name}
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title">{concert.name}</h6>
                                        <p className="card-text small">
                                            <strong>{concert.artistName}</strong><br />
                                            📅 {new Date(concert.date).toLocaleDateString()}<br />
                                            📍 {concert.venue}<br />
                                            💰 ${concert.price}
                                        </p>
                                        <button
                                            className="btn btn-primary btn-sm mt-auto"
                                            onClick={() => navigate(`/purchase/${concert.id}`)}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <p className="mb-0">No upcoming concerts available at the moment. Check back soon!</p>
                    </div>
                )}
            </div>

            {/* Past Performances Section */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>🎭 Your Past Performances</h3>
                    <Link to="/purchase-history" className="btn btn-outline-primary btn-sm">
                        View Full History →
                    </Link>
                </div>
                {pastPurchases.length > 0 ? (
                    <div className="row">
                        {pastPurchases.map((purchase) => (
                            <div key={purchase.id} className="col-md-4 mb-4">
                                <div className="card shadow-sm hover-card">
                                    <div className="card-body">
                                        <h6 className="card-title">{purchase.concertName}</h6>
                                        <p className="card-text small">
                                            <strong>Artist:</strong> {purchase.artistName}<br />
                                            <strong>Venue:</strong> {purchase.venue}<br />
                                            <strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}<br />
                                            <strong>Tickets:</strong> {purchase.ticketsBought}<br />
                                            <strong>Total:</strong> ${purchase.totalPrice}
                                        </p>
                                        <p className="text-muted small mb-0">
                                            Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <p className="mb-0">You haven't attended any concerts yet. Book your first concert now!</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="row mb-5">
                <div className="col-md-4 mb-3">
                    <div className="card text-center shadow-sm hover-card" style={{ cursor: "pointer" }} onClick={() => navigate("/artists")}>
                        <div className="card-body">
                            <h1>🎤</h1>
                            <h5 className="card-title">Explore Artists</h5>
                            <p className="card-text">Discover talented artists from around the world</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-center shadow-sm hover-card" style={{ cursor: "pointer" }} onClick={() => navigate("/book-concerts")}>
                        <div className="card-body">
                            <h1>🎫</h1>
                            <h5 className="card-title">Book Concerts</h5>
                            <p className="card-text">Reserve your spot at upcoming concerts</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-center shadow-sm hover-card" style={{ cursor: "pointer" }} onClick={() => navigate("/favorites")}>
                        <div className="card-body">
                            <h1>⭐</h1>
                            <h5 className="card-title">Your Favorites</h5>
                            <p className="card-text">Keep track of your favorite artists</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for hover effects */}
            <style>{`
                .hover-card {
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
                }
            `}</style>
        </div>
    );
};

export default Home;