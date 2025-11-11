import React,{useEffect,useState} from "react";
import axios from "axios";

interface Artist {
    id: string;
    name: string;
    genre: string;
    country: string;
    image: string;
    description: string;
}

interface Favorite {
    id?: string;
    userId: string;
    artistId: string;
    artistName: string;
    artistImage: string;
}

const Artists :React.FC = () =>{
    const [artists,setArtists] = useState<Artist[]>([]);
    const [favorites,setFavorites] = useState<Favorite[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string>("");
    const [successMsg,setSuccessMsg]  = useState<string>("");

    const userDetails = sessionStorage.getItem("user");
    const user = userDetails ? JSON.parse(userDetails) : null;

    useEffect(()=>{
        fetchArtists();
        if(user){
            fetchFavorites();
        }
    },[]);

    const fetchArtists = async() =>{
        try{
            const response  = await axios.get<Artist[]>("http://localhost:3001/artists");
            setArtists(response.data);
            setLoading(false);
        }catch(err){
            setError("Failed to load artists");
            setLoading(false);
        }
    }

    const fetchFavorites = async() =>{
        try{
            const response = await axios.get<Favorite[]>("http://localhost:3001/fav?userId="+user.id);
            setFavorites(response.data);
        }catch(err){
            console.error("Failed to load favorites", err);
        }
    }

    const isAritstFavorited = (artistId :string) : boolean =>{
        return favorites.some(fav => fav.artistId === artistId)
    }

    const handleAddTOFavorites = async (artist:Artist) =>{
        if(!user){
            setError("Please login to add favorites");
            return;
        }
        if(isAritstFavorited(artist.id)){
            setError("Artist is already in your favorites!");
            setTimeout(() => setError(""), 3000);
            return;
        }

        try{
           const favoriteData: Favorite = {
                userId: user.id,
                artistId: artist.id,
                artistName: artist.name,
                artistImage: artist.image 
        };

        await axios.post("http://localhost:3001/fav",favoriteData);
        setSuccessMsg(`${artist.name} added to favorites!`);
            fetchFavorites(); // Refresh favorites list
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            setError("Failed to add to favorites");
            setTimeout(() => setError(""), 3000);
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

    return(
        <div className="container mt-4">
            <h2 className="mb-4">Artists 🎤</h2>
            {error && (<div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>)}
            {successMsg && ( <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMsg}
                    <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
                </div>)}
                 <div className="row">
                {artists.map((artist)=>{
                    return(
                    <div className="card h-100 shdow-sm">
                        <img
                        src = {artist.image}
                        className="card-img-top"
                        alt={artist.name}
                        style={{height:"200px", objectFit:"cover"}}
                        />
                        <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{artist.name}</h5>
                                <p className="card-text">
                                    <strong>Genre:</strong> {artist.genre}<br />
                                    <strong>Country:</strong> {artist.country}
                                </p>
                                <p className="card-text text-muted small">{artist.description}</p>
                                <button
                                    className={`btn mt-auto ${
                                        isAritstFavorited(artist.id)
                                            ? "btn-success"
                                            : "btn-outline-primary"
                                    }`}
                                     onClick={() => handleAddTOFavorites(artist)}
                                    disabled={isAritstFavorited(artist.id)}
                                >
                                    {isAritstFavorited(artist.id) ? "✓ Added to Favorites" : "⭐ Add to Favorites"}
                                </button>
                            </div>
                        </div>

                    )})}
            </div>
            </div>
    )
                }        

export default Artists;