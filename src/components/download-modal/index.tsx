import { component$, useSignal } from "@builder.io/qwik";
import { Modal, ModalContent } from "@qwik-ui/headless";
import { InDownload } from "@qwikest/icons/iconoir";

interface DownloadModalProps {
  title: string;
}

export const DownloadModal = component$<DownloadModalProps>((props) => {
  const showModal = useSignal(false);

  return (
    <>
      <button
        onClick$={() => (showModal.value = true)}
        class="flex items-center space-x-3 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium hover:bg-neutral-700"
      >
        <InDownload class="h-4 w-4 stroke-[3]" />
        <span>Download</span>
      </button>

      <Modal
        bind:show={showModal}
        class="ep-modal-anim w-full max-w-md overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100 backdrop:bg-black/50"
      >
        <ModalContent class="p-6">
          <h1 class="mb-2 block text-center text-xl">Download this episode</h1>
          <h2 class="mx-auto max-w-[50ch] text-center text-neutral-500">
            Do you really want to download {props.title}?
          </h2>

          <div class="mt-6 flex flex-wrap gap-2">
            <button
              onClick$={() => (showModal.value = false)}
              class="w-full rounded-lg bg-neutral-800 py-2 text-sm font-bold hover:bg-neutral-700 lg:flex-1"
            >
              Close
            </button>
            <button class="w-full rounded-lg bg-cyan-200 py-2 text-sm font-bold text-neutral-950 lg:flex-1">
              Yes, please.
            </button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
});
