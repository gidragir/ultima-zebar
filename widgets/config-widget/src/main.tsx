import { ConfigProvider } from "@ultima-zebar/config";
import "@ultima-zebar/ui/fonts.css";
import "@ultima-zebar/ui/index.css";
import "@ultima-zebar/ui/theme.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<ConfigProvider>
			<App />
		</ConfigProvider>
	</React.StrictMode>,
);