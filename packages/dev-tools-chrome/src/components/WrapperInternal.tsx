export function WrapperInternal({
  children
}: React.PropsWithChildren<unknown>) {
  console.log('WrapperInternal')
  return <>{children}</>
}
