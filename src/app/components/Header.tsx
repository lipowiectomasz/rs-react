type HeaderProps = {
  title?: string;
};

export default function Header(props: HeaderProps) {
  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  );
}
