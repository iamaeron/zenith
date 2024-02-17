import { component$ } from "@builder.io/qwik";
import SideLink from "./side-link";
import {
  InBookmarkCircle,
  InHomeAlt,
  InRefreshCircular,
  InSearch,
} from "@qwikest/icons/iconoir";
import { Link } from "@builder.io/qwik-city";
import ZenithLogo from "/zenith-logo.svg";

const SideLinks = component$(() => {
  return (
    <div class="sticky top-0 h-screen border-r border-neutral-800 py-6">
      <div class="flex flex-col items-center px-6">
        <Link
          href="/"
          class="mb-10 block border-b border-neutral-800 px-4 pb-4"
        >
          <img src={ZenithLogo} width={40} height={40} />
        </Link>
        <nav class="flex flex-col items-center space-y-2">
          <SideLink name="Home" to="/">
            <InHomeAlt class="h-7 w-7 stroke-2" />
          </SideLink>
          <SideLink name="Search" to="/search">
            <InSearch class="h-7 w-7 stroke-2" />
          </SideLink>
          <SideLink name="Randomize" to="/randomize">
            <InRefreshCircular class="h-7 w-7 stroke-2" />
          </SideLink>
          <SideLink name="Bookmarks" to="/bookmarks">
            <InBookmarkCircle class="h-7 w-7 stroke-2" />
          </SideLink>
        </nav>
      </div>
    </div>
  );
});

export default SideLinks;
