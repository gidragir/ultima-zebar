import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@ultima-zebar/ui/theme.css";
import "@ultima-zebar/ui/index.css";
import "@ultima-zebar/ui/fonts.css";
import { ConfigProvider } from "@ultima-zebar/config";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
	<StrictMode>
		<ConfigProvider>
			<App />
		</ConfigProvider>
	</StrictMode>,
);