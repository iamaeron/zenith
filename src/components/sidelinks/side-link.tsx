import { Slot, component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

interface SideLinkProps {
  to: string;
  name: string;
}

const SideLink = component$<SideLinkProps>((props) => {
  const loc = useLocation();
  const isActive =
    props.to === "/"
      ? props.to === loc.url.pathname
      : props.to + "/" === loc.url.pathname;

  return (
    <Link
      href={props.to}
      data-title={props.name}
      class={[
        "relative block rounded-xl p-4 transition-all before:pointer-events-none before:absolute before:left-full before:ml-2 before:origin-left before:scale-75 before:rounded-md before:bg-neutral-800 before:p-2 before:py-1 before:text-sm before:font-medium before:text-neutral-300 before:opacity-0 before:shadow before:transition-all before:content-[attr(data-title)] hover:before:scale-100 hover:before:opacity-100 active:scale-90 active:opacity-80",
        isActive ? "bg-cyan-200 text-neutral-950" : "hover:bg-neutral-800",
      ]}
    >
      <Slot />
    </Link>
  );
});

export default SideLink;
