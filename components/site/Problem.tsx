import NotReady from "./_NotReady";

export default function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-h2">
      <h2 id="problem-h2" className="sr-only">
        A food-rescue system that cannot see itself.
      </h2>
      <NotReady name="Problem" />
    </section>
  );
}
