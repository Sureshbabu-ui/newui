export function ContainerPage({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div className='container-fluid page mt-4'>
      <div className='row'> {children} </div>
    </div>
  );
}
