import React, { useEffect, useState } from "react";
import axios from "axios";

interface Favorite {
    id: string;
    userId: string;
    artistId: string;
    artistName: string;
    artistImage: string;
}

const Fav: React.FC = () => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const userDetails = sessionStorage.getItem("user");
    const user = userDetails ? JSON.parse(userDetails) : null;

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get<Favorite[]>(
                `http://localhost:3001/favorites?userId=${user.id}`
            );
            setFavorites(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load favorites");
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (favoriteId: string) => {
        if (window.confirm("Are you sure you want to remove this artist from favorites?")) {
            try {
                await axios.delete(`http://localhost:3001/favorites/${favoriteId}`);
                setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
            } catch (err) {
                setError("Failed to remove favorite");
            }
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

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Your Favorites ⭐</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {favorites.length > 0 ? (
                <div className="row">
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className="col-md-4 col-lg-3 mb-4">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={favorite.artistImage}
                                    className="card-img-top"
                                    alt={favorite.artistName}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{favorite.artistName}</h5>
                                    <button
                                        className="btn btn-danger mt-auto"
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
                <div className="alert alert-info" role="alert">
                    <h5>No favorites yet!</h5>
                    <p>You haven't added any artists to your favorites. Start exploring and add your favorite artists!</p>
                    <a href="/artists" className="btn btn-primary">
                        Browse Artists
                    </a>
                </div>
            )}
        </div>
    );
};

export default Fav;