import { useStore } from '../../state/storeHooks';

export function Footer() {
  const { user } = useStore(({ app }) => app);
  return (
    user.match({
      none: () => <></>,
      some: () => <FooterContent />,
    })
  );
}

function FooterContent() {
  return (
    <footer>
      <div className='container'>
        <a href='/' className='logo-font'>
          conduit
        </a>
        <span className='attribution'>
          An interactive learning project from <a href='https://thinkster.io'>Thinkster</a>. Code &amp; design licensed
          under MIT.
        </span>
      </div>
    </footer>
  );
}
