import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import './Pokemon.css';

export default function Pokemon() {
    const [notice, setNotice] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [allPokemons, setAllPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [formData, setFormData] = useState({
        pokemonOwnerName: "",
        direction: "",
        initialpositionx: "",
        pokemonName: "",
        pokemonAbility: "",
        initialPositiony: "",
        speed: "",
        lastlyDirection: "",
    });

    useEffect(() => {
        getAllPokemons();
    }, []);

    const getAllPokemons = async () => {
        try {
            const response = await axios.get("https://apexplusbackend.onrender.com/api/v1/pokemon/getAllPokemons");
            setAllPokemons(response.data.pokemons);
            setFilteredPokemons(response.data.pokemons);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch Pokemons. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://apexplusbackend.onrender.com/api/v1/pokemon/createPokemon",
                formData
            );
            console.log(response.data);
            alert("Pokemon created successfully!");
            setNotice(false);
            setFormData({
                pokemonOwnerName: "",
                direction: "",
                initialpositionx: "",
                pokemonName: "",
                pokemonAbility: "",
                initialPositiony: "",
                speed: "",
                lastlyDirection: "",
            });
            getAllPokemons();
        } catch (error) {
            console.error(error);
            alert("Failed to create Pokemon. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://apexplusbackend.onrender.com/api/v1/pokemon/deletePokemonById/${id}`);
            alert("Pokemon deleted successfully!");
            getAllPokemons();
        } catch (error) {
            console.error(error);
            alert("Failed to delete Pokemon. Please try again.");
        }
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axios.patch(`https://apexplusbackend.onrender.com/api/v1/pokemon/updatePokemonById/${editId}`, formData);
            console.log(response.data);
            alert("Pokemon information updated successfully!");
            setShowEdit(false);
            getAllPokemons();
        } catch (error) {
            console.error(error);
            alert("Failed to update Pokemon information. Please try again.");
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (editId) {
                const res = await axios.get(
                    `https://apexplusbackend.onrender.com/api/v1/pokemon/getPokemonById/${editId}`
                );
                console.log(res.data.pokemon, "res");
                setFormData(res.data.pokemon);
            }
        };
        getData();
    }, [editId]);

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        const filtered = allPokemons.filter((pokemon) =>
            pokemon.pokemonName.toLowerCase().includes(searchQuery)
        );
        setFilteredPokemons(filtered);
    };

    return (
        <>
            <div className="container">
                <div className="container">
                    <div className="button-container">
                        <button
                            onClick={() => setNotice(!notice)}
                            className="button button-primary"
                        >
                            Add New Pokemon
                        </button>
                    </div>
                    <div className="container-content">
                        <div className="search-container">
                            <label className="search-label" for="search">Search:</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="search..."
                                onChange={handleSearch}
                            />
                        </div>

                        <table className="table">
                            <thead>
                                <tr >
                                    <th>SL No</th>
                                    <th>Owner Name</th>
                                    <th>Pokemon Name</th>
                                    <th>Ability</th>
                                    <th>Direction</th>
                                    <th>Initial Position X</th>
                                    <th>Initial Position Y</th>
                                    <th>Speed</th>
                                    <th>Lastly Direction</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPokemons.map((pokemon, index) => (
                                    <tr key={pokemon._id}>
                                        <td>{index + 1}</td>
                                        <td>{pokemon.pokemonOwnerName}</td>
                                        <td>{pokemon.pokemonName}</td>
                                        <td>{pokemon.pokemonAbility}</td>
                                        <td>{pokemon.direction}</td>
                                        <td>{pokemon.initialpositionx}</td>
                                        <td>{pokemon.initialPositiony}</td>
                                        <td>{pokemon.speed}</td>
                                        <td>{pokemon.lastlyDirection}</td>
                                        <td>
                                            <div>
                                                <div className="action-buttons">
                                                    <button
                                                        className="button button-outline"
                                                        onClick={() => {
                                                            setEditId(pokemon._id);
                                                            setShowEdit(true);
                                                        }}
                                                    >
                                                        <AiOutlineEdit size={20} />
                                                    </button>
                                                    <button
                                                        className="button button-outline"
                                                        onClick={() => handleDelete(pokemon._id)}
                                                    >
                                                        <AiOutlineDelete size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button className="button button-outline">Previous</button>
                            <button className="button button-outline">1</button>
                            <button className="button button-outline">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            {notice && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">Add New Pokemon</div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label
                                    htmlFor="pokemonOwnerName"
                                >
                                    Owner Name
                                </label>
                                <input
                                    className="input"
                                    id="pokemonOwnerName"
                                    type="text"
                                    name="pokemonOwnerName"
                                    value={formData.pokemonOwnerName}
                                    onChange={handleChange}
                                    placeholder="Enter Owner Name"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="form-group"
                                    htmlFor="pokemonName"
                                >
                                    Pokemon Name
                                </label>
                                <input
                                    className="input"
                                    id="pokemonName"
                                    type="text"
                                    name="pokemonName"
                                    value={formData.pokemonName}
                                    onChange={handleChange}
                                    placeholder="Enter Pokemon Name"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="form-group"
                                    htmlFor="pokemonAbility"
                                >
                                    Ability
                                </label>
                                <input
                                    className="input"
                                    id="pokemonAbility"
                                    type="text"
                                    name="pokemonAbility"
                                    value={formData.pokemonAbility}
                                    onChange={handleChange}
                                    placeholder="Enter Ability"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="form-group"
                                    htmlFor="direction"
                                >
                                    Direction
                                </label>
                                <input
                                    className="input"
                                    id="direction"
                                    type="text"
                                    name="direction"
                                    value={formData.direction}
                                    onChange={handleChange}
                                    placeholder="Enter Direction"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="form-group"
                                    htmlFor="initialpositionx"
                                >
                                    Initial Position X
                                </label>
                                <input
                                    className="input"
                                    id="initialpositionx"
                                    type="number"
                                    name="initialpositionx"
                                    value={formData.initialpositionx}
                                    onChange={handleChange}
                                    placeholder="Enter Initial Position X"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="form-group"
                                    htmlFor="initialPositiony"
                                >
                                    Initial Position Y
                                </label>
                                <input
                                    className="input"
                                    id="initialPositiony"
                                    type="number"
                                    name="initialPositiony"
                                    value={formData.initialPositiony}
                                    onChange={handleChange}
                                    placeholder="Enter Initial Position Y"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="form-group"
                                    htmlFor="speed"
                                >
                                    Speed
                                </label>
                                <input
                                    className="input"
                                    id="speed"
                                    type="text"
                                    name="speed"
                                    value={formData.speed}
                                    onChange={handleChange}
                                    placeholder="Enter Speed"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="form-group"
                                    htmlFor="lastlyDirection"
                                >
                                    Lastly Direction
                                </label>
                                <input
                                    className="input"
                                    id="lastlyDirection"
                                    type="text"
                                    name="lastlyDirection"
                                    value={formData.lastlyDirection}
                                    onChange={handleChange}
                                    placeholder="Enter Lastly Direction"
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="button button-cancel"
                                    onClick={() => setNotice(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="button button-secondary"
                                >
                                    Save
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEdit && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">Edit Pokemon</div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label
                                    htmlFor="pokemonOwnerName"
                                >
                                    Owner Name
                                </label>
                                <input
                                    className="input"
                                    id="pokemonOwnerName"
                                    type="text"
                                    name="pokemonOwnerName"
                                    value={formData.pokemonOwnerName}
                                    onChange={handleChange}
                                    placeholder="Enter Owner Name"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="pokemonName"
                                >
                                    Pokemon Name
                                </label>
                                <input
                                    className="input"
                                    id="pokemonName"
                                    type="text"
                                    name="pokemonName"
                                    value={formData.pokemonName}
                                    onChange={handleChange}
                                    placeholder="Enter Pokemon Name"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="pokemonAbility"
                                >
                                    Ability
                                </label>
                                <input
                                    className="input"
                                    id="pokemonAbility"
                                    type="text"
                                    name="pokemonAbility"
                                    value={formData.pokemonAbility}
                                    onChange={handleChange}
                                    placeholder="Enter Ability"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="direction"
                                >
                                    Direction
                                </label>
                                <input
                                    className="input"
                                    id="direction"
                                    type="text"
                                    name="direction"
                                    value={formData.direction}
                                    onChange={handleChange}
                                    placeholder="Enter Direction"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="initialpositionx"
                                >
                                    Initial Position X
                                </label>
                                <input
                                    className="input"
                                    id="initialpositionx"
                                    type="number"
                                    name="initialpositionx"
                                    value={formData.initialpositionx}
                                    onChange={handleChange}
                                    placeholder="Enter Initial Position X"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="initialPositiony"
                                >
                                    Initial Position Y
                                </label>
                                <input
                                    className="input"
                                    id="initialPositiony"
                                    type="number"
                                    name="initialPositiony"
                                    value={formData.initialPositiony}
                                    onChange={handleChange}
                                    placeholder="Enter Initial Position Y"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="speed"
                                >
                                    Speed
                                </label>
                                <input
                                    className="input"
                                    id="speed"
                                    type="text"
                                    name="speed"
                                    value={formData.speed}
                                    onChange={handleChange}
                                    placeholder="Enter Speed"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="lastlyDirection"
                                >
                                    Lastly Direction
                                </label>
                                <input
                                    className="input"
                                    id="lastlyDirection"
                                    type="text"
                                    name="lastlyDirection"
                                    value={formData.lastlyDirection}
                                    onChange={handleChange}
                                    placeholder="Enter Lastly Direction"
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={() => setShowEdit(false)}
                                    className="button button-cancel"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="button button-secondary"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}