
import { getShowData, getEpisodeList } from "./services/tvmaze.js";

const ID = "2993";

const $header = document.querySelector("#show-header");
const $episodes = document.querySelector(".episodes");

const createEpisodeHTML = (episode) => {
    const element = document.createElement("div");

    const rating = episode.rating === null
        ? 0
        : Math.max(0, Math.min(10, Math.round(episode.rating)));

    element.className = `episode episode-${episode.number} rating-${rating}`;
    element.textContent = episode.number ?? "-";
    element.title = `Episodio ${episode.number} - Valoración: ${episode.rating ?? "Sin valoración"}`;

    return element;
};

const createSeasonHTML = (episodes, number) => {
    const season = document.createElement("article");
    season.className = "season";

    const seasonHeader = document.createElement("header");
    seasonHeader.className = "season-header";
    seasonHeader.textContent = `T${number}`;

    season.append(seasonHeader);

    episodes.forEach(episode => {
        season.append(createEpisodeHTML(episode));
    });

    return season;
};

const showHeader = (show) => {
    const poster = document.createElement("img");
    poster.className = "poster";
    poster.src = show.image;
    poster.alt = `Póster de ${show.name}`;

    const info = document.createElement("div");
    info.className = "show-info";

    const title = document.createElement("h1");
    title.textContent = show.name;

    const rating = document.createElement("p");
    rating.textContent = `Valoración: ${show.rating ?? "Sin valoración"}`;

    info.append(title, rating);
    $header.replaceChildren(poster, info);
};

const showSeasons = (seasons) => {
    const fragment = document.createDocumentFragment();

    Object.entries(seasons).forEach(([number, episodes]) => {
        fragment.append(createSeasonHTML(episodes, number));
    });

    $episodes.replaceChildren(fragment);
};

const loadShow = async () => {
    $header.textContent = "Cargando serie...";

    try {
        const [show, seasons] = await Promise.all([
            getShowData(ID),
            getEpisodeList(ID)
        ]);

        showHeader(show);
        showSeasons(seasons);

    } catch (error) {
        $header.textContent = "Error al cargar la serie.";
        console.error(error);
    }
};

loadShow();
