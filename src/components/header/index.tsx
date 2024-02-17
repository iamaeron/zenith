import { $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { InSearch } from "@qwikest/icons/iconoir";

export const Header = component$(() => {
  const scrolled = useSignal(false);
  const loc = useLocation();
  const atWatchPage = loc.url.pathname.split("/")[1] === "watch";

  useOnWindow(
    "scroll",
    $(() => {
      if (!atWatchPage) scrolled.value = window.scrollY > 4;
    }),
  );

  return (
    <header
      class={[
        "left-0 right-0 top-0 z-50 flex items-center justify-between border-b px-10 duration-300",
        !atWatchPage && "sticky",
        scrolled.value
          ? "border-white/10 bg-neutral-900 py-2"
          : "border-transparent py-6",
      ]}
    >
      <Link href="/" class="flex w-max items-start space-x-3">
        <h1 class="text-2xl font-bold tracking-tight text-cyan-200 [text-shadow:0_2px_6px_rgba(0,0,0,0.1)]">
          Zenith
        </h1>
      </Link>
      <div>
        <div
          class={[
            "flex items-center space-x-2 rounded-full bg-neutral-800 px-3.5 py-2.5 backdrop-blur-md",
          ]}
        >
          <InSearch class={"h-5 w-5 stroke-2 text-neutral-500"} />
          <input
            type="text"
            placeholder="Search for an anime"
            class={[
              "bg-transparent text-sm outline-none placeholder:text-neutral-500",
            ]}
          />
        </div>
      </div>
    </header>
  );
});
