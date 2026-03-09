import { mount } from "svelte";
import App from "./App.svelte";
import "./app.css";
import "./globals.css";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
