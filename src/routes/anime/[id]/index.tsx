import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { InArrowRight, InBookmarkEmpty, InPlay } from "@qwikest/icons/iconoir";
import { Tab, TabList, TabPanel, Tabs } from "@qwik-ui/headless";
import { EpListTabPanel } from "~/components/episode-list/eplist-tab-panel";

type AnimeStatus = "FINISHED" | "RELEASING" | "NOT_YET_RELEASED";
type AnimeSeason = "SUMMER" | "FALL" | "NOT_YET_RELEASED";

export const useAnimeInfo = routeLoader$(async ({ params }) => {
  const res = await fetch(`http://localhost:8080/api/v2/info/${params.id}`);
  const anime = await res.json();

  if (anime.code && (anime.code === 404 || anime.code === 400))
    return { notFound: true };

  return { ...anime, notFound: false };
});

export const useAnimeEpisodesInfo = routeLoader$(async ({ resolveValue }) => {
  const anime = await resolveValue(useAnimeInfo);

  if (!anime.id_provider || !anime.id_provider.idGogo) return { noData: true };

  const res = await fetch(
    `http://localhost:8080/api/v1/episode/${anime.id_provider.idGogo}`,
  );

  const resDub = await fetch(
    `http://localhost:8080/api/v1/episode/${anime.id_provider.idGogoDub}`,
  );
  const episodes = await res.json();
  const episodesDub = await resDub.json();
  return { episodes, episodesDub, noData: false };
});

export default component$(() => {
  const anime = useAnimeInfo();
  const epData = useAnimeEpisodesInfo();

  const statusColors = {
    FINISHED: "text-emerald-300",
    RELEASING: "text-cyan-300",
    NOT_YET_RELEASED: "text-yellow-300",
  };

  const seasonColors = {
    WINTER: "text-blue-300",
    SUMMER: "text-yellow-300",
    FALL: "text-orange-300",
    SPRING: "text-amber-300",
    NOT_YET_RELEASED: "text-yellow-300",
  };

  return (
    <div class="min-h-screen bg-neutral-900 text-neutral-100">
      {anime.value.notFound ? (
        <div>anime not found</div>
      ) : (
        <div>
          <div
            class="flex h-[250px] w-full items-end overflow-hidden rounded-2xl"
            style={`background-repeat: no-repeat; background-image: url(${
              anime.value.bannerImage ?? anime.value.coverImage.large
            }); background-size: cover`}
          ></div>
          <div class="flex gap-8">
            <img
              src={anime.value.coverImage.large}
              alt={anime.value.title.userPreferred}
              height={300}
              width={200}
              class="sticky top-24 -mt-20 ml-4 h-60 w-40 rounded-2xl object-cover shadow-[0_-10px_40px_0] shadow-black/30"
            />
            <div class="w-full pt-4">
              <p class="max-w-[40ch] text-3xl font-bold ">
                {anime.value.title.english}
              </p>
              <p class="max-w-[60ch] text-neutral-500">
                {anime.value.title.userPreferred}
              </p>
              <p class="max-w-[60ch] text-neutral-500">
                {anime.value.title.native}
              </p>
              <div class="mb-6 mt-4 flex items-center gap-3 text-neutral-500">
                <div class="flex items-center space-x-2 text-sm">
                  <span>
                    <span>{anime.value.year ?? "No data"}</span>
                  </span>
                </div>
                <div class="h-0.5 w-0.5 rounded-full bg-white/30"></div>
                <div
                  class={
                    "flex items-center space-x-1 text-sm uppercase text-blue-300"
                  }
                >
                  <span>subbed</span>
                </div>
                {anime.value.dub && (
                  <div class="flex gap-3 text-blue-300">
                    &
                    <div class="flex items-center space-x-1 text-sm uppercase">
                      <span>dubbed</span>
                    </div>
                  </div>
                )}
                <div class="h-0.5 w-0.5 rounded-full bg-white/30"></div>
                <div
                  class={[
                    "flex items-center space-x-1 text-sm ",
                    statusColors[anime.value.status as AnimeStatus],
                  ]}
                >
                  <span>{anime.value.status.replaceAll("_", " ")}</span>
                </div>
                <div class="h-0.5 w-0.5 rounded-full bg-white/30"></div>
                <div
                  class={[
                    "flex items-center space-x-1 text-sm ",
                    seasonColors[anime.value.season as AnimeSeason],
                  ]}
                >
                  {anime.value.season ?? "No data"}
                </div>
              </div>
              <div class="mb-6 flex items-center gap-4">
                {anime.value.status !== "NOT_YET_RELEASED" ? (
                  <button class="group relative flex w-max select-none items-center space-x-3 rounded-lg bg-cyan-200 px-5 py-2.5 text-sm font-bold text-neutral-950 transition-all hover:shadow-[0_0_20px_0] hover:shadow-cyan-200/20">
                    <InPlay class="h-5 w-5 translate-y-0 stroke-[3] transition-all group-hover:translate-y-0 group-hover:opacity-0" />
                    <span class="translate-x-2 transition group-hover:-translate-x-3.5">
                      Play Episode 1
                    </span>
                    <InArrowRight class="h-4 w-4 -translate-x-5 stroke-[3] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                ) : (
                  <div class="select-none rounded-lg border border-neutral-800 px-5 py-2.5 text-neutral-500">
                    Not available
                  </div>
                )}
                <button class="flex items-center space-x-3 rounded-lg bg-neutral-800 px-5 py-2.5 text-sm transition-all hover:bg-neutral-700">
                  <InBookmarkEmpty class="h-5 w-5 stroke-[3]" />
                  <span>Add to Bookmarks</span>
                </button>
              </div>
              <Tabs class="w-full rounded-xl border border-neutral-800">
                <TabList class="mb-2 flex flex-wrap gap-2 border-b border-neutral-800 px-4">
                  <Tab
                    class="relative px-4 py-3 text-sm"
                    selectedClassName="group active !text-cyan-200"
                  >
                    About
                    <div class="absolute bottom-0 left-0 right-0 hidden h-0.5 rounded-t-md bg-cyan-200 group-[.active]:block"></div>
                  </Tab>
                  <Tab
                    class="relative px-4 py-3 text-sm"
                    selectedClassName="group active !text-cyan-200"
                  >
                    Episodes
                    <div class="absolute bottom-0 left-0 right-0 hidden h-0.5 rounded-t-md bg-cyan-200 group-[.active]:block"></div>
                  </Tab>
                  <Tab
                    class="relative px-4 py-3 text-sm"
                    selectedClassName="group active !text-cyan-200"
                  >
                    Related
                    <div class="absolute bottom-0 left-0 right-0 hidden h-0.5 rounded-t-md bg-cyan-200 group-[.active]:block"></div>
                  </Tab>
                  <Tab
                    class="relative px-4 py-3 text-sm"
                    selectedClassName="group active !text-cyan-200"
                  >
                    Recommendations
                    <div class="absolute bottom-0 left-0 right-0 hidden h-0.5 rounded-t-md bg-cyan-200 group-[.active]:block"></div>
                  </Tab>
                </TabList>

                <TabPanel class="p-4">
                  <h1>Description</h1>

                  <p
                    dangerouslySetInnerHTML={anime.value.description}
                    class="mt-2 text-neutral-500"
                  ></p>
                  <div class="mt-8">
                    <h1>Genres</h1>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      {anime.value.genres.map((genre: string) => (
                        <button
                          key={genre}
                          class="w-max rounded-md bg-neutral-800 px-2 py-1 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100"
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div class="mt-8">
                    <h1>Tags</h1>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      {anime.value.tags.map(
                        (tag: { id: string; name: string }) => (
                          <button
                            key={tag.id}
                            class="w-max rounded-md bg-neutral-800 px-2 py-1 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100"
                          >
                            {tag.name}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel class="p-4">
                  {epData.value.noData ? (
                    <div>no eps</div>
                  ) : (
                    <EpListTabPanel
                      anime={anime.value}
                      episodes={epData.value.episodes.episodes}
                      episodesDub={epData.value.episodesDub.episodes}
                    />
                  )}
                </TabPanel>
                <TabPanel class="p-4">Related animes</TabPanel>
                <TabPanel class="p-4">Recommended animes</TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = (ev) => {
  const anime = ev.resolveValue(useAnimeInfo);

  return {
    title: anime.notFound
      ? "Anime not found - Zenith"
      : `${anime.title.english} - Zenith`,
    // other meta data goes here
  };
};
