const typeSymbols = [
  {
    type: "Bug",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Pok%C3%A9mon_Bug_Type_Icon.svg",
  },
  {
    type: "Dark",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Pok%C3%A9mon_Dark_Type_Icon.svg",
  },
  {
    type: "Dragon",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/a/a6/Pok%C3%A9mon_Dragon_Type_Icon.svg",
  },
  {
    type: "Fairy",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Pok%C3%A9mon_Fairy_Type_Icon.svg",
  },
  {
    type: "Fighting",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/b/be/Pok%C3%A9mon_Fighting_Type_Icon.svg",
  },
  {
    type: "Fire",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Pok%C3%A9mon_Fire_Type_Icon.svg",
  },
  {
    type: "Flying",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/e/e0/Pok%C3%A9mon_Flying_Type_Icon.svg",
  },
  {
    type: "Ghost",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/Pok%C3%A9mon_Ghost_Type_Icon.svg ",
  },
  {
    type: "Grass",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Pok%C3%A9mon_Grass_Type_Icon.svg ",
  },
  {
    type: "Ground",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Pok%C3%A9mon_Ground_Type_Icon.svg",
  },
  {
    type: "Ice",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Pok%C3%A9mon_Ice_Type_Icon.svg",
  },
  {
    type: "Normal",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/a/aa/Pok%C3%A9mon_Normal_Type_Icon.svg",
  },
  {
    type: "Poison",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Pok%C3%A9mon_Poison_Type_Icon.svg",
  },
  {
    type: "Psychic",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/Pok%C3%A9mon_Psychic_Type_Icon.svg",
  },
  {
    type: "Rock",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Pok%C3%A9mon_Rock_Type_Icon.svg",
  },
  {
    type: "Steel",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/3/38/Pok%C3%A9mon_Steel_Type_Icon.svg ",
  },
  {
    type: "Water",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Pok%C3%A9mon_Water_Type_Icon.svg",
  },
  {
    type: "Electric",
    url:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Pok%C3%A9mon_Electric_Type_Icon.svg",
  },
];

let evo = [];

//first fetch for the primary pokemon
function fetchPokemon(name) {
  fetch("https://pokeapi.co/api/v2/pokemon/" + name + "")
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(".main").classList.remove("loading");
      displayPokemon(data);
    })
    .catch((err) => console.log("Error: ", err));
}

// fetch the species of the the pokemon
function fetchSpecies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      fetchEvolution(data);
      fetchDescription(data);
    })
    .catch((err) => console.log("Error: ", err));
}

//display pokemon description
function fetchDescription(data) {
  const { flavor_text } = data.flavor_text_entries[0];
  document.querySelector(".desc").innerHTML = flavor_text;
}

//fetch the evolution chain of the pokemon
function fetchEvolution(data) {
  const { url } = data.evolution_chain;
  if (url) {
    fetch(url)
      .then((res) => res.json())
      .then((d) => displayEvo(d))
      .catch((err) => console.log("Error: ", err));
  }
}

//ctaches the evolution pokemon's name and adds it to the array + fetchs the evolution chain
function displayEvo(data) {
  const { species } = data.chain;
  if (!evo.includes(species.name)) evo.unshift(species.name);
  const { name } = data.chain.evolves_to[0].species;
  if (!evo.includes(name)) evo.push(name);
  console.log(evo);
  if (data.chain.evolves_to[0].evolves_to[0]) {
    if (!evo.includes(data.chain.evolves_to[0].evolves_to[0].species.name))
      evo.push(data.chain.evolves_to[0].evolves_to[0].species.name);
  }
  fetchEvo(evo);
}

// fetchs the evolution chain
function fetchEvo(array) {
  array.forEach((name) => {
    if (document.querySelector(".name").innerHTML != capitalize(name)) {
      fetch("https://pokeapi.co/api/v2/pokemon/" + name + "")
        .then((res) => res.json())
        .then((data) => displayEvolution(data))
        .catch((err) => console.log("Error: ", err));
    }
  });
}

//displays the evolution in the DOM
function displayEvolution(data) {
  const { front_default } = data.sprites.other["official-artwork"];
  let btnr = document.createElement("button");
  setListener(btnr);
  btnr.className = "nextP";
  btnr.setAttribute("id", data.name);
  let img = document.createElement("img");
  img.className = "evo";
  img.setAttribute("src", front_default);
  document.querySelector(".evolution").appendChild(btnr).appendChild(img);
}

//display's the pokemon stats in the DOM
function displayPokemon(data) {
  const { name, id, abilities, types, weight, height } = data;
  // const { front_default, back_default } = data.sprites;
  const { front_default } = data.sprites.other["official-artwork"];
  let type = typeSymbols.find((v) => v.type === capitalize(types[0].type.name));
  const { url } = data.species;
  //
  fetchSpecies(url);
  if (!evo.includes(name)) evo.push(name);
  console.log(name, id, abilities, types, weight, height, front_default);
  document.querySelector(".type").src = type.url;
  document.querySelector(".name").innerText = capitalize(name);
  document.querySelector(".avatarF").src = front_default;
  document.querySelector(".id").innerText = "Index: " + id;
  document.querySelector(".abilities").innerText = `Ability: ${capitalize(
    abilities[0].ability.name
  )}`;
  document.querySelector(".types").innerText =
    "Type: " + capitalize(types[0].type.name);
  document.querySelector(".height").innerText =
    "Height: " + height * 10 + " cm";
  document.querySelector(".weight").innerText =
    "Weight: " + weight / 10 + " kgs";
}

//capitalizes the first letter of a string
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

//catches the value of the searched pokemon the starts the fetch with it
function search() {
  fetchPokemon(document.querySelector(".search").value);
}

document.querySelector(".btn").addEventListener("click", function () {
  search();
  evo = [];
  document.querySelectorAll(".nextP").forEach((e) => e.remove());
  document.querySelector(".search").value = "";
});
document.querySelector(".search").addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    search();
    evo = [];
    document.querySelectorAll(".nextP").forEach((e) => e.remove());
    document.querySelector(".search").value = "";
  }
});

function setListener(el) {
  el.addEventListener("click", function () {
    id = el.id;
    document.querySelectorAll(".nextP").forEach((e) => e.remove());
    fetchPokemon(id);
  });
}

//add symbols to the type (can make a different ffile with an obj of types and value of img based on type and compare it before displaying)
