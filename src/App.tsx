import { useEffect, useState } from "react";

type PokemonAll = {
  name: string;
  url: string;
};

type PokemonDetail = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
};

function App() {
  // useSatet
  const [pokemons, setPoken] = useState<PokemonAll[]>([]);
  const [pokemonDetails, setPokenDetails] = useState<PokemonDetail[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [reset, setReset] = useState<boolean>(false);
  // this API URL
  const url = "https://pokeapi.co/api/v2/pokemon";

  // get pokemons
  const getPokemonsUrl = async () => {
    const response = await fetch(url);
    const data = await response.json();
    setPoken(data.results);
  };

  // get pokemon detail
  const getPokemonDetail = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      sprites: {
        front_default: data.sprites.front_default,
      },
    };
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      await getPokemonsUrl();

      // Wait for all pokemon details to be fetched before setting the state
      const details = await Promise.all(
        pokemons.map((pokemon) => getPokemonDetail(pokemon.url))
      );
      setPokenDetails(details);
    };

    fetchPokemons();
  }, [reset]);

  const searchPokemon = () => {
    // const resultList = pokemonDetails.filter((i) => i.name == keyword);
    const resultList = pokemonDetails.filter(
      (i) => i.name.indexOf(keyword) !== -1
    );
    console.log(resultList);
    setPokenDetails(resultList);
    return;
  };

  return (
    <>
      <input
        type="text"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
      />
      <button
        onClick={() => {
          searchPokemon();
        }}
      >
        検索
      </button>
      <button
        onClick={() => {
          setReset(!reset);
        }}
      >
        リセット
      </button>
      {pokemonDetails.map((item) => {
        return (
          <div
            key={item.id}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img src={item.sprites.front_default} />
            <p style={{ textAlign: "center" }}>{item.name}</p>
          </div>
        );
      })}
    </>
  );
}

export default App;
