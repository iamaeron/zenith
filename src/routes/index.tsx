import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  Link,
  useNavigate,
} from "@builder.io/qwik-city";
import { InArrowRight, InClock } from "@qwikest/icons/iconoir";

export const usePopularAnime = routeLoader$(async () => {
  const res = await fetch("http://localhost:8080/api/v2/popular");
  const popularAnime = await res.json();

  return popularAnime;
});

export const useTrendingAnime = routeLoader$(async () => {
  const res = await fetch("http://localhost:8080/api/v2/trending");
  const { results: trendingAnimes } = await res.json();
  return trendingAnimes;
});

export default component$(() => {
  const popularAnime = usePopularAnime();
  const trendingAnimes = useTrendingAnime();
  const trendingAnime =
    trendingAnimes.value[
      Math.floor(Math.random() * trendingAnimes.value.length)
    ];

  const navigate = useNavigate();

  return (
    <>
      <div>
        <div
          class="flex h-[400px] w-full items-end overflow-hidden rounded-2xl"
          style={`background-repeat: no-repeat; background-image: url(${
            trendingAnime.bannerImage ?? trendingAnime.coverImage.large
          }); background-size: cover`}
        >
          <div class="flex h-full w-full flex-col justify-end bg-gradient-to-t from-black/90 via-black/70 to-black/0 p-10 pb-10">
            <div class="flex items-end gap-6">
              <img
                src={trendingAnime.coverImage.large}
                alt={trendingAnime.title.userPreferred}
                width={200}
                height={300}
                class="rounded-lg"
              />
              <div>
                <div>
                  <p class="mb-1 font-semibold text-white">Trending now</p>
                </div>
                <h1 class="text-3xl font-bold text-white">
                  {trendingAnime.title.english}
                </h1>
                <div class="mb-2 mt-1 flex items-center space-x-2 text-white/60">
                  <div class="flex items-center space-x-1 text-sm">
                    <InClock class="stroke-[3]" />
                    <span>
                      <span>{trendingAnime.seasonYear}</span>
                    </span>
                  </div>
                  <div class="h-0.5 w-0.5 rounded-full bg-white/30"></div>
                  <div class="flex items-center space-x-1 text-sm">
                    {trendingAnime.status} {`(${trendingAnime.season})`}
                  </div>
                  <div class="h-0.5 w-0.5 rounded-full bg-white/30"></div>
                  <div class="flex items-center space-x-1 text-sm">
                    {trendingAnime.genres[0]}
                  </div>
                </div>
                <p class="line-clamp-2 max-w-[80ch] text-white">
                  {trendingAnime.description
                    .replaceAll("<br>", "")
                    .replaceAll("<i>", "")
                    .replaceAll("</i>", "")}
                </p>

                <button
                  onClick$={() => navigate(`/anime/${trendingAnime.id}`)}
                  class="group mt-6 flex w-max select-none items-center space-x-3 rounded-lg  bg-white/[0.05] px-5 py-2.5 font-bold text-white backdrop-blur-md transition hover:bg-white/10 active:scale-95 active:opacity-80"
                >
                  <span class="translate-x-3 transition group-hover:translate-x-0">
                    Check out
                  </span>
                  <InArrowRight class="h-4 w-4 stroke-[3] opacity-0 transition group-hover:opacity-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 class="mb-4 mt-10 text-2xl font-semibold">Trending animes</h1>
      <div class="grid grid-cols-6 justify-center gap-10 rounded-2xl border border-neutral-800 p-5">
        {trendingAnimes.value.map((anime: any) => (
          <div key={anime.id} class="flex flex-col items-center">
            <Link href={`/anime/${anime.id}`} class="group">
              <img
                src={anime.coverImage.large}
                alt=""
                width={200}
                height={200}
                class="h-auto w-full rounded-xl transition-all group-hover:-translate-y-4 group-hover:scale-110 group-active:scale-90 group-active:opacity-80"
              />
              <div class="p-3">
                <p class="line-clamp-2 text-center text-sm font-medium">
                  {anime.title.english ?? anime.title.userPreferred}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <h1 class="mb-4 mt-10 text-2xl font-semibold">Popular animes</h1>
      <div class="grid grid-cols-6 justify-center gap-10 rounded-2xl border border-neutral-800 p-5">
        {popularAnime.value.results.map((anime: any) => (
          <div key={anime.id} class="flex flex-col items-center">
            <Link href={`/anime/${anime.id}`} class="group">
              <img
                src={anime.coverImage.large}
                alt=""
                width={200}
                height={200}
                class="h-auto w-full rounded-xl transition-all group-hover:-translate-y-4 group-hover:scale-110 group-active:scale-90 group-active:opacity-80"
              />
              <div class="p-3">
                <p class="line-clamp-2 text-center text-sm font-medium">
                  {anime.title.english ?? anime.title.userPreferred}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div class="py-10">
        <button>Can't decide what to watch?</button>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Zenith",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
