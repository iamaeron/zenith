import type { NoSerialize, QRL, QwikIntrinsicElements } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import Artplayer from "artplayer";
import type { Option } from "artplayer/types/option";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import artplayerPluginVttThumbnail from "artplayer-plugin-thumbnail";
import Hls from "hls.js";
import { useLocation } from "@builder.io/qwik-city";

declare global {
  interface Window {
    hls: NoSerialize<Hls>;
  }
}

type PlayerProps = {
  option: Omit<Option, "container">;
  thumbnail: string;
  getInstance$: QRL<(art: Artplayer) => any> | undefined;
} & QwikIntrinsicElements["div"];

export const Player = component$<PlayerProps>(
  ({ option, thumbnail, getInstance$, ...rest }) => {
    const artRef = useSignal<HTMLDivElement>();
    const store = useStore<{
      artInstance: NoSerialize<Artplayer>;
      hlsInstance: NoSerialize<Hls>;
    }>({
      artInstance: undefined,
      hlsInstance: undefined,
    });
    const loc = useLocation();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup, track }) => {
      track(() => loc.url.pathname);

      const hls = new Hls();
      store.hlsInstance = noSerialize(hls);
      window.hls = store.hlsInstance;

      const art = new Artplayer({
        // eslint-disable-next-line qwik/valid-lexical-scope
        ...option,
        container: artRef.value ?? "",
        plugins: [
          artplayerPluginVttThumbnail({
            vtt: thumbnail,
          }),
          artplayerPluginHlsQuality({
            control: false,
            setting: true,
            auto: "Auto",
          }),
        ],
        screenshot: true,
        miniProgressBar: true,
        airplay: true,
        autoSize: true,
        setting: true,
        fullscreen: true,
        fullscreenWeb: true,
        playbackRate: true,
        fastForward: false,
        autoPlayback: true,
        autoOrientation: true,
        pip: navigator.userAgent.match(/(chrome|edg|safari|opr)/i)
          ? true
          : false,
        playsInline: true,
        autoplay: false,
        autoMini: false,
        theme: "#22d3ee",
        customType: {
          m3u8: async function (video, url) {
            if (Hls.isSupported()) {
              window.hls?.loadSource(url);
              window.hls?.attachMedia(video);
            } else {
              const canPlay = video.canPlayType(
                "application/vnd.apple.mpegurl",
              );
              if (canPlay === "probably" || canPlay == "maybe") {
                video.src = url;
              } else {
                if (store.artInstance)
                  store.artInstance.notice.show =
                    "Does not support playback of m3u8";
              }
            }
          },
        },
      });

      store.artInstance = noSerialize(art);

      if (getInstance$ && typeof getInstance$ === "function") {
        getInstance$(art);
      }

      cleanup(() => {
        if (store.artInstance) store.artInstance.destroy(false);
      });
    });

    return (
      <div
        ref={artRef}
        {...rest}
        class="aspect-video overflow-hidden rounded-xl"
      ></div>
    );
  },
);
