import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

interface EpisodeListProps {
  episodes: any[];
  link: string;
  title: string;
  currentEpisode: string;
}

export const EpisodeList = component$<EpisodeListProps>((props) => {
  const loc = useLocation();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => loc.url.pathname);

    const item = document.querySelector("[data-active=true]");
    item?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  return (
    <div class="h-max max-h-[28rem] max-w-md flex-1 overflow-hidden overflow-y-auto rounded-xl border border-neutral-800 pb-0">
      <header class="border-b border-neutral-800 px-8 py-4">
        <p>{props.title}</p>
      </header>
      <div class="p-4">
        {props.episodes
          .sort(
            (a, b) =>
              Number(a.id.split("-episode-")[1]) -
              Number(b.id.split("-episode-")[1]),
          )
          .map((episode: any) => (
            <div
              data-active={`${
                episode.id.split("-episode-")[1] === props.currentEpisode
              }`}
              key={episode.id}
              class="py-1 last:pb-4"
            >
              <Link
                href={props.link + "-" + episode.id}
                class={[
                  "block rounded-lg px-4 py-2 text-left",
                  episode.id.split("-episode-")[1] === props.currentEpisode
                    ? "bg-cyan-200/10 text-cyan-200"
                    : "hover:bg-neutral-800",
                ]}
              >
                Episode {episode.id.split("-episode-")[1]}
                <p
                  class={[
                    "text-sm",
                    episode.id.split("-episode-")[1] === props.currentEpisode
                      ? "text-cyan-200/60"
                      : "text-neutral-500",
                  ]}
                >
                  Episode
                </p>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
});
