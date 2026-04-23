import NotReady from "./_NotReady";

export default function LiveState() {
  return (
    <section id="live-state" aria-labelledby="live-state-h2">
      <h2 id="live-state-h2" className="sr-only">
        Abound opens one console every morning.
      </h2>
      <NotReady name="LiveState" />
    </section>
  );
}
