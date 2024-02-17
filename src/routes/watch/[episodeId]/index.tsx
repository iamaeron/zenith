import { $, component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  useNavigate,
  useLocation,
} from "@builder.io/qwik-city";
import { HiChevronRightMini } from "@qwikest/icons/heroicons";
import { InAirplay } from "@qwikest/icons/iconoir";
import type Artplayer from "artplayer";
import { DownloadModal } from "~/components/download-modal";
import { EpisodeList } from "~/components/episode-list";
import { Player } from "~/components/player";

export const useAnimeInfo = routeLoader$(async ({ params }) => {
  const res = await fetch(
    `http://localhost:8080/api/v2/info/${params.episodeId.split("-")[0]}`,
  );
  const anime = await res.json();
  return anime;
});

export const useStreamAnime = routeLoader$(async ({ params }) => {
  const id = params.episodeId.split("-")[0];
  const gogoIDWithEp = params.episodeId.split(`${id}-`)[1];
  const res = await fetch(
    `http://localhost:8080/api/v2/stream/${gogoIDWithEp}`,
  );
  const anime = await res.json();
  return anime;
});

export const useAnimeEpisodesInfo = routeLoader$(async ({ params }) => {
  const id = params.episodeId.split("-")[0];
  const gogoIDWithEp = params.episodeId.split(`${id}-`)[1];
  const gogoID = gogoIDWithEp.split(`-episode`)[0];

  const res = await fetch(`http://localhost:8080/api/v1/episode/${gogoID}`);

  const episodes = await res.json();
  return episodes;
});

export default component$(() => {
  const streamAnimeInfo = useStreamAnime();
  const animeInfo = useAnimeInfo();
  const episodes = useAnimeEpisodesInfo();
  const nav = useNavigate();
  const getID = useLocation().params.episodeId.split("-")[0];
  const getGogoID = useLocation().params.episodeId.split(`${getID}-`)[1];
  const getEP = getGogoID.split(`-episode-`)[1];

  const getInstance = $((art: Artplayer) => {
    art.setting.add({
      html: "Stream Source",
      width: 200,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon" class="w-6 h-6">
  <path d="M5.507 4.048A3 3 0 0 1 7.785 3h8.43a3 3 0 0 1 2.278 1.048l1.722 2.008A4.533 4.533 0 0 0 19.5 6h-15c-.243 0-.482.02-.715.056l1.722-2.008Z" />
  <path fill-rule="evenodd" d="M1.5 10.5a3 3 0 0 1 3-3h15a3 3 0 1 1 0 6h-15a3 3 0 0 1-3-3Zm15 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM4.5 15a3 3 0 1 0 0 6h15a3 3 0 1 0 0-6h-15Zm11.25 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM19.5 18a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" clip-rule="evenodd" />
</svg>
`,
      tooltip: "Main",
      selector: [
        {
          default: true,
          html: "Main",
          url: streamAnimeInfo.value.stream.multi.main.url,
        },
        {
          default: false,
          html: "Backup",
          url: streamAnimeInfo.value.stream.multi.backup.url,
        },
      ],
      onSelect(item) {
        art.switchQuality(item.url);
        return item.html;
      },
    });
  });

  return (
    <>
      <div class="flex gap-10">
        <div class="flex-1">
          <Player
            option={{
              url: streamAnimeInfo.value.stream.multi.main.url,
              poster:
                animeInfo.value.bannerImage || animeInfo.value.coverImage.large,
            }}
            thumbnail={streamAnimeInfo.value.stream.tracks.file}
            getInstance$={getInstance}
          />
          <div class="pb-10 pt-6">
            <div class="mb-4 mt-4 flex items-end justify-between border-b border-neutral-800 pb-4">
              <div class="flex items-center space-x-4">
                <h1 class="text-xl">
                  Episode {streamAnimeInfo.value.info.episode}
                </h1>
                <button
                  onClick$={() => {
                    const currentEpisodeIndex =
                      episodes.value.episodes.findIndex(
                        (episode: any) =>
                          episode.id.split(`-episode-`)[1] === getEP,
                      );
                    const nextEpisode =
                      episodes.value.episodes[currentEpisodeIndex + 1];

                    if (
                      currentEpisodeIndex ===
                      episodes.value.episodes.length - 1
                    ) {
                      return;
                    } else {
                      nav(
                        `/watch/${getID}-${
                          getGogoID.split(`-episode-`)[0]
                        }-episode-${nextEpisode.id.split(`-episode-`)[1]}`,
                      );
                    }
                  }}
                  class="flex items-center space-x-2 text-sm text-cyan-200 underline-offset-4 hover:underline"
                >
                  <span>Play next episode</span>
                  <HiChevronRightMini />
                </button>
              </div>

              <div class="flex gap-2">
                <button class="flex items-center space-x-3 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium hover:bg-neutral-700">
                  <InAirplay class="mt-0.5 h-4 w-4 stroke-[3]" />
                  <span>Change player</span>
                </button>
                <DownloadModal
                  title={`${streamAnimeInfo.value.info.title} Episode ${streamAnimeInfo.value.info.episode}`}
                />
              </div>
            </div>
            <h1 class="text-2xl font-bold">{animeInfo.value.title.english}</h1>
            <h1 class="text-neutral-500">
              {animeInfo.value.title.userPreferred}
            </h1>
            <h1 class="text-neutral-500">{animeInfo.value.title.native}</h1>
          </div>
        </div>

        <EpisodeList
          title={episodes.value.title}
          episodes={episodes.value.episodes}
          link={`/watch/${animeInfo.value.id}`}
          currentEpisode={streamAnimeInfo.value.info.episode}
        />
      </div>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const animeInfo = resolveValue(useAnimeInfo);
  const streamInfo = resolveValue(useStreamAnime);

  return {
    title: `Watch ${animeInfo.title.english} Episode ${streamInfo.info.episode} on Zenith`,
    // other meta data goes here
  };
};
