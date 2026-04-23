import NotReady from "./_NotReady";

export default function Picture() {
  return (
    <section id="picture" aria-labelledby="picture-h2">
      <h2 id="picture-h2" className="sr-only">
        One shared picture, used by coalition leaders.
      </h2>
      <NotReady name="Picture" />
    </section>
  );
}
