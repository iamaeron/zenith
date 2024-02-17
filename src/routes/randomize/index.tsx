import { component$ } from "@builder.io/qwik";
import { routeAction$, type DocumentHead, Form } from "@builder.io/qwik-city";
import { InEmojiPuzzled, InRefreshDouble } from "@qwikest/icons/iconoir";

export const useRandomGenerate = routeAction$(async (_, { redirect }) => {
  const res = await fetch(`http://localhost:8080/api/v2/random?generated=40`);
  const { id } = await res.json();
  const random = id[Math.floor(Math.random() * id.length)];

  throw redirect(302, `/anime/${random}`);
});

export default component$(() => {
  const randomizeAction = useRandomGenerate();

  return (
    <div class="pb-20 pt-10">
      <InEmojiPuzzled class="mx-auto mb-4 h-20 w-20 text-neutral-500" />
      <h1 class="text-center text-3xl">Don't know what to watch?</h1>
      <div class="flex justify-center">
        <Form action={randomizeAction}>
          <button class="mt-10 flex flex-col items-center rounded-xl border border-neutral-800 p-5 text-lg hover:border-neutral-700">
            <InRefreshDouble
              class={[
                "h-14 w-14 transition-all",
                randomizeAction.isRunning && "animate-spin text-cyan-200",
              ]}
            />
            <span class="mt-4 block">Let Zenith decide</span>
          </button>
        </Form>
      </div>
    </div>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Randomize",
    // other meta data goes here
  };
};
