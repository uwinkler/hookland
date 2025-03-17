import { Outlet } from "react-router";
import { RandomGameAppBar } from "./AppBar/RandomGameAppBar";
import { Layout } from "./Layout";

export function LayoutWithAppBar() {
  return <>
    <RandomGameAppBar />
    <Layout>
      <Outlet />
    </Layout>
  </>
}