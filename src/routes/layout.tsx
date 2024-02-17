import { component$, Slot } from "@builder.io/qwik";
import { useLocation, type RequestHandler } from "@builder.io/qwik-city";
import { QwikNProgress } from "@iamaeron/qwik-nprogress";
import { QwikUIProvider } from "@qwik-ui/headless";
import { Header } from "~/components/header";
import SideLinks from "~/components/sidelinks";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const loc = useLocation();

  return (
    <QwikUIProvider>
      <div class={["h-auto min-h-screen bg-neutral-900 text-zinc-200"]}>
        <QwikNProgress option={{ color: "#A5F3FC" }} />
        <div
          class={[
            "mx-auto flex w-full max-w-screen-2xl transition-all",
            loc.isNavigating
              ? "pointer-events-none opacity-60"
              : "pointer-events-auto opacity-100",
          ]}
        >
          <SideLinks />
          <div class="flex-1 border-r border-neutral-800">
            <Header />
            <div class="p-10 pt-5">
              <Slot />
            </div>
            <footer class="mt-20 border-t border-neutral-800 p-10">
              Made with ❤️ by Aeron
            </footer>
          </div>
        </div>
      </div>
    </QwikUIProvider>
  );
});
