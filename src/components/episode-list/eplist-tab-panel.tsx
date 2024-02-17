import { component$, useSignal } from "@builder.io/qwik";
import { type Episode } from "../anime-info/episode-modal";
import { Tab, TabList, TabPanel, Tabs } from "@qwik-ui/headless";
import { Link } from "@builder.io/qwik-city";

interface EpListTabPanelProps {
  anime: {
    [k: string]: any;
  };
  episodes: Episode[] | null;
  episodesDub: Episode[] | null;
}

export const EpListTabPanel = component$<EpListTabPanelProps>((props) => {
  const isDub = useSignal(false);
  const sortOld = useSignal(false);

  return (
    <div>
      <Tabs>
        <TabList class="flex space-x-2 border-b border-neutral-800 px-2 pb-6 text-sm">
          <Tab
            class="w-max rounded-full px-4 py-1.5 hover:bg-neutral-800"
            selectedClassName="!bg-cyan-200 !text-neutral-900 font-bold"
          >
            GogoAnime
          </Tab>
          <Tab
            class="w-max rounded-full px-4 py-1.5 hover:bg-neutral-800"
            selectedClassName="!bg-cyan-200 !text-neutral-900 font-bold"
          >
            Other Providers
          </Tab>
        </TabList>
        <TabPanel class="pt-2">
          {props.episodes ? (
            <div class="px-2">
              <div class="mb-2 mt-2 flex items-center gap-4 p-2 px-4">
                <p>Episode List</p>
                <div class="flex gap-2">
                  <div class="flex gap-1 rounded-full border border-neutral-800 p-1">
                    <button
                      onClick$={() => (sortOld.value = false)}
                      class={[
                        "rounded-full px-2 py-0.5 text-sm font-semibold",
                        !sortOld.value && "bg-cyan-200 text-neutral-950",
                      ]}
                    >
                      LATEST
                    </button>
                    <button
                      onClick$={() => (sortOld.value = true)}
                      class={[
                        "rounded-full px-2 py-0.5 text-sm font-semibold",
                        sortOld.value && "bg-cyan-200 text-neutral-950",
                      ]}
                    >
                      OLDEST
                    </button>
                  </div>

                  <div class="flex gap-1 rounded-full border border-neutral-800 p-1">
                    <button
                      onClick$={() => (isDub.value = false)}
                      class={[
                        "rounded-full px-2 py-0.5 text-sm font-semibold",
                        !isDub.value && "bg-cyan-200 text-neutral-950",
                      ]}
                    >
                      SUB
                    </button>
                    <button
                      onClick$={() => (isDub.value = true)}
                      class={[
                        "rounded-full px-2 py-0.5 text-sm font-semibold",
                        isDub.value && "bg-cyan-200 text-neutral-950",
                      ]}
                    >
                      DUB
                    </button>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-6 gap-2">
                {!isDub.value
                  ? sortOld.value
                    ? props.episodes
                        .sort(
                          (a, b) =>
                            Number(a.id.split("-episode-")[1]) -
                            Number(b.id.split("-episode-")[1]),
                        )
                        .map((episode) => (
                          <EpisodeItem
                            key={episode.id}
                            animeId={props.anime.id}
                            episode={episode}
                            dubbed={false}
                          />
                        ))
                    : props.episodes
                        .sort(
                          (a, b) =>
                            Number(b.id.split("-episode-")[1]) -
                            Number(a.id.split("-episode-")[1]),
                        )
                        .map((episode) => (
                          <EpisodeItem
                            key={episode.id}
                            animeId={props.anime.id}
                            episode={episode}
                            dubbed={false}
                          />
                        ))
                  : null}

                {isDub.value ? (
                  props.episodesDub ? (
                    sortOld.value ? (
                      props.episodesDub
                        .sort(
                          (a, b) =>
                            Number(a.id.split("-episode-")[1]) -
                            Number(b.id.split("-episode-")[1]),
                        )
                        .map((episode) => (
                          <EpisodeItem
                            key={episode.id}
                            animeId={props.anime.id}
                            episode={episode}
                            dubbed={true}
                          />
                        ))
                    ) : (
                      props.episodesDub
                        .sort(
                          (a, b) =>
                            Number(b.id.split("-episode-")[1]) -
                            Number(a.id.split("-episode-")[1]),
                        )
                        .map((episode) => (
                          <EpisodeItem
                            key={episode.id}
                            animeId={props.anime.id}
                            episode={episode}
                            dubbed={true}
                          />
                        ))
                    )
                  ) : (
                    <div class="p-4 py-10 text-center text-neutral-500">
                      No available dub episodes
                    </div>
                  )
                ) : null}
              </div>
            </div>
          ) : (
            <div class="p-4 py-10 text-center text-neutral-500">
              No available episodes
            </div>
          )}
        </TabPanel>
        <TabPanel>Hey</TabPanel>
      </Tabs>
    </div>
  );
});

interface EpisodeItemProps {
  animeId: string;
  dubbed: boolean;
  episode: {
    [k: string]: any;
  };
}

const EpisodeItem = component$<EpisodeItemProps>((props) => {
  return (
    <Link
      href={`/watch/${props.animeId}-${props.episode.id}`}
      key={props.episode.id}
      class="block select-none rounded-lg p-4 text-left hover:bg-neutral-800 active:scale-95 active:opacity-80"
    >
      <p class="text-lg">{props.episode.id.split("-episode-")[1]}</p>
      <p class="text-sm text-neutral-500">
        Episode{" "}
        <span
          class={[
            "inline-block rounded-md px-1.5 py-0.5 text-xs font-medium",
            props.dubbed
              ? "bg-yellow-400/10 text-yellow-400"
              : "bg-indigo-400/10 text-indigo-400",
          ]}
        >
          {props.dubbed ? "DUB" : "SUB"}
        </span>
      </p>
    </Link>
  );
});
