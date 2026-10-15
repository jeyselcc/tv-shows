
const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

const getData = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
};

export const getShowData = async (id) => {
    const URL = `https://api.tvmaze.com/shows/${id}`;
    const data = await getData(URL);

    return {
        name: data.name,
        rating: data.rating?.average ?? null,
        image: data.image?.medium ?? PLACEHOLDER_IMAGE
    };
};

export const getEpisodeList = async (id) => {
    const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
    const episodes = await getData(URL);

    const episodeList = episodes.map(episode => ({
        number: episode.number,
        season: episode.season,
        rating: episode.rating?.average ?? null
    }));

    return Object.groupBy(
        episodeList,
        episode => episode.season
    );
};
