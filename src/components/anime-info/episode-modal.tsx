import { component$, useSignal } from "@builder.io/qwik";
import { InArrowRight, InPlay } from "@qwikest/icons/iconoir";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@qwik-ui/headless";
import { useNavigate } from "@builder.io/qwik-city";
import { HiXMarkSolid } from "@qwikest/icons/heroicons";

export interface Episode {
  title: string;
  id: string;
}

interface EpisodeProps {
  anime: {
    [k: string]: any;
  };
  episodes: Episode[] | null;
  episodesDub: Episode[] | null;
}

export const EpisodeModal = component$<EpisodeProps>((props) => {
  const showModal = useSignal(false);
  const nav = useNavigate();
  const isDub = useSignal(false);
  const sortOld = useSignal(false);

  return (
    <>
      {props.anime.status !== "NOT_YET_RELEASED" ? (
        <button
          onClick$={() => (showModal.value = true)}
          class="group text-sm relative flex w-max select-none items-center space-x-3 rounded-lg bg-cyan-200 px-5 py-2.5 font-bold text-neutral-950 transition-all hover:shadow-[0_0_20px_0] hover:shadow-cyan-200/20"
        >
          <InPlay class="h-5 w-5 translate-y-0 stroke-[3] transition-all group-hover:translate-y-0 group-hover:opacity-0" />
          <span class="translate-x-2 transition group-hover:-translate-x-3.5">
            Watch now
          </span>
          <InArrowRight class="h-4 w-4 -translate-x-5 stroke-[3] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </button>
      ) : (
        <div class="select-none rounded-lg border border-neutral-800 px-5 py-2.5 text-neutral-500">
          Not available
        </div>
      )}

      <Modal
        bind:show={showModal}
        class="ep-modal-anim w-full max-w-lg overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100 backdrop:bg-black/50"
      >
        <div class="h-[32rem] overflow-y-auto">
          <ModalHeader class="sticky top-0 flex items-center justify-between bg-neutral-900/70 px-4 py-2 font-semibold backdrop-blur-md">
            <p>Choose an episode</p>
            <button
              onClick$={() => (showModal.value = false)}
              class="rounded-full bg-neutral-800 p-2 hover:bg-neutral-700"
            >
              <HiXMarkSolid class="h-5 w-5" />
            </button>
          </ModalHeader>
          <ModalContent class="p-2 pt-0">
            <div>
              <Tabs>
                <TabList class="flex space-x-1 rounded-lg px-2 text-sm">
                  <Tab
                    class="flex-1 rounded-full py-1.5 hover:bg-neutral-800"
                    selectedClassName="!bg-cyan-200/10 !text-cyan-200"
                  >
                    GogoAnime
                  </Tab>
                  <Tab
                    class="flex-1 rounded-full py-1.5 hover:bg-neutral-800"
                    selectedClassName="!bg-cyan-200/10 !text-cyan-200"
                  >
                    Other Providers
                  </Tab>
                </TabList>
                <TabPanel class="pt-2">
                  {props.episodes ? (
                    <div class="px-2">
                      <div class="mb-2 mt-2 flex items-center justify-between border border-x-0 border-neutral-800 p-2 px-4">
                        <p class="font-semibold text-cyan-200">Episode List</p>
                        <div class="flex gap-2">
                          <div class="flex gap-1 rounded-lg bg-neutral-800 p-1">
                            <button
                              onClick$={() => (sortOld.value = false)}
                              class={[
                                "rounded-md px-2 py-0.5 text-sm font-semibold",
                                !sortOld.value &&
                                  "bg-cyan-200 text-neutral-950",
                              ]}
                            >
                              NEW
                            </button>
                            <button
                              onClick$={() => (sortOld.value = true)}
                              class={[
                                "rounded-md px-2 py-0.5 text-sm font-semibold",
                                sortOld.value && "bg-cyan-200 text-neutral-950",
                              ]}
                            >
                              OLD
                            </button>
                          </div>

                          <div class="flex gap-1 rounded-lg bg-neutral-800 p-1">
                            <button
                              onClick$={() => (isDub.value = false)}
                              class={[
                                "rounded-md px-2 py-0.5 text-sm font-semibold",
                                !isDub.value && "bg-cyan-200 text-neutral-950",
                              ]}
                            >
                              SUB
                            </button>
                            <button
                              onClick$={() => (isDub.value = true)}
                              class={[
                                "rounded-md px-2 py-0.5 text-sm font-semibold",
                                isDub.value && "bg-cyan-200 text-neutral-950",
                              ]}
                            >
                              DUB
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-1">
                        {!isDub.value
                          ? sortOld.value
                            ? props.episodes
                                .sort(
                                  (a, b) =>
                                    Number(a.id.split("-episode-")[1]) -
                                    Number(b.id.split("-episode-")[1]),
                                )
                                .map((episode) => (
                                  <button
                                    onClick$={() => {
                                      document.body.removeAttribute("style");
                                      nav(
                                        `/watch/${props.anime.id}-${episode.id}`,
                                      );
                                    }}
                                    key={episode.id}
                                    class="block w-full rounded-lg px-4 py-2 text-left transition hover:bg-neutral-800"
                                  >
                                    <p>{episode.title}</p>
                                    <p class="text-sm text-neutral-500">
                                      Episode {episode.id.split("-episode-")[1]}
                                    </p>
                                  </button>
                                ))
                            : props.episodes
                                .sort(
                                  (a, b) =>
                                    Number(b.id.split("-episode-")[1]) -
                                    Number(a.id.split("-episode-")[1]),
                                )
                                .map((episode) => (
                                  <button
                                    onClick$={() => {
                                      document.body.removeAttribute("style");
                                      nav(
                                        `/watch/${props.anime.id}-${episode.id}`,
                                      );
                                    }}
                                    key={episode.id}
                                    class="block w-full rounded-lg px-4 py-2 text-left transition hover:bg-neutral-800"
                                  >
                                    <p>{episode.title}</p>
                                    <p class="text-sm text-neutral-500">
                                      Episode {episode.id.split("-episode-")[1]}
                                    </p>
                                  </button>
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
                                  <button
                                    onClick$={() => {
                                      document.body.removeAttribute("style");
                                      nav(
                                        `/watch/${props.anime.id}-${episode.id}`,
                                      );
                                    }}
                                    key={episode.id}
                                    class="block w-full rounded-lg px-4 py-2 text-left transition hover:bg-neutral-800"
                                  >
                                    <p>{episode.title}</p>
                                    <p class="text-sm text-neutral-500">
                                      Episode {episode.id.split("-episode-")[1]}
                                    </p>
                                  </button>
                                ))
                            ) : (
                              props.episodesDub
                                .sort(
                                  (a, b) =>
                                    Number(b.id.split("-episode-")[1]) -
                                    Number(a.id.split("-episode-")[1]),
                                )
                                .map((episode) => (
                                  <button
                                    onClick$={() => {
                                      document.body.removeAttribute("style");
                                      nav(
                                        `/watch/${props.anime.id}-${episode.id}`,
                                      );
                                    }}
                                    key={episode.id}
                                    class="block w-full rounded-lg px-4 py-2 text-left transition hover:bg-neutral-800"
                                  >
                                    <p>{episode.title}</p>
                                    <p class="text-sm text-neutral-500">
                                      Episode {episode.id.split("-episode-")[1]}
                                    </p>
                                  </button>
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
          </ModalContent>
        </div>
      </Modal>
    </>
  );
});
